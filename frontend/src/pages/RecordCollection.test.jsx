import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RecordCollection from './RecordCollection.jsx';

// Mock farmerService
const mockGetAllFarmers = jest.fn();
const mockRecordCollection = jest.fn();
jest.mock('../services/farmerService', () => ({
  getAllFarmers: mockGetAllFarmers,
  recordCollection: mockRecordCollection,
}));

// Mock react-router-dom
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderRecordCollection = () => {
  return render(
    <BrowserRouter>
      <RecordCollection />
    </BrowserRouter>
  );
};

describe('RecordCollection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllFarmers.mockResolvedValue([
      { _id: '1', name: 'Farmer One', region: 'Central', contractedCrop: 'Maize' },
      { _id: '2', name: 'Farmer Two', region: 'Coast', contractedCrop: 'Rice' },
    ]);
  });

  test('renders form and fetches farmers', async () => {
    renderRecordCollection();
    expect(screen.getByText('Record Harvest')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAllFarmers).toHaveBeenCalled();
    });

    expect(screen.getByText('Farmer One - Central')).toBeInTheDocument();
    expect(screen.getByText('Farmer Two - Coast')).toBeInTheDocument();
  });

  test('auto-fills crop when farmer is selected', async () => {
    const user = userEvent.setup();
    renderRecordCollection();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const cropInput = screen.getByLabelText('Crop');

    await user.selectOptions(farmerSelect, '1');

    expect(cropInput.value).toBe('Maize');
  });

  test('formats payment rate input', async () => {
    const user = userEvent.setup();
    renderRecordCollection();

    const paymentRateInput = screen.getByLabelText('Payment Rate (KES per Kg)');

    await user.type(paymentRateInput, '2550');

    expect(paymentRateInput.value).toBe('2,550.00');
  });

  test('submits form successfully', async () => {
    const user = userEvent.setup();
    const mockCollection = { farmer: '1', weight: 500.5 };
    mockRecordCollection.mockResolvedValue(mockCollection);

    renderRecordCollection();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const harvestDateInput = screen.getByLabelText('Harvest Date');
    const collectionDateInput = screen.getByLabelText('Collection Date');
    const weightInput = screen.getByLabelText('Weight (in Kg)');
    const qualityGradeSelect = screen.getByLabelText('Quality Grade');
    const paymentRateInput = screen.getByLabelText('Payment Rate (KES per Kg)');
    const submitButton = screen.getByRole('button', { name: 'Record Collection' });

    await user.selectOptions(farmerSelect, '1');
    await user.clear(harvestDateInput);
    await user.type(harvestDateInput, '2023-10-01');
    await user.clear(collectionDateInput);
    await user.type(collectionDateInput, '2023-10-02');
    await user.type(weightInput, '500.5');
    await user.selectOptions(qualityGradeSelect, 'A');
    await user.type(paymentRateInput, '25.50');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRecordCollection).toHaveBeenCalledWith({
        farmerId: '1',
        crop: 'Maize',
        harvestDate: '2023-10-01',
        collectionDate: '2023-10-02',
        weight: 500.5,
        qualityGrade: 'A',
        paymentRate: 25.5,
      });
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/farmer/1');
  });

  test('handles submission error', async () => {
    const user = userEvent.setup();
    mockRecordCollection.mockRejectedValue(new Error('Submission failed'));

    renderRecordCollection();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const harvestDateInput = screen.getByLabelText('Harvest Date');
    const weightInput = screen.getByLabelText('Weight (in Kg)');
    const paymentRateInput = screen.getByLabelText('Payment Rate (KES per Kg)');
    const submitButton = screen.getByRole('button', { name: 'Record Collection' });

    await user.selectOptions(farmerSelect, '1');
    await user.clear(harvestDateInput);
    await user.type(harvestDateInput, '2023-10-01');
    await user.type(weightInput, '500');
    await user.type(paymentRateInput, '25');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRecordCollection).toHaveBeenCalled();
    });

    expect(screen.getByText('Failed to record collection.')).toBeInTheDocument();
  });

  test('shows loading state', async () => {
    const user = userEvent.setup();
    mockRecordCollection.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ farmer: '1', weight: 500 }), 100)));

    renderRecordCollection();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const harvestDateInput = screen.getByLabelText('Harvest Date');
    const weightInput = screen.getByLabelText('Weight (in Kg)');
    const paymentRateInput = screen.getByLabelText('Payment Rate (KES per Kg)');
    const submitButton = screen.getByRole('button', { name: 'Record Collection' });

    await user.selectOptions(farmerSelect, '1');
    await user.clear(harvestDateInput);
    await user.type(harvestDateInput, '2023-10-01');
    await user.type(weightInput, '500');
    await user.type(paymentRateInput, '25');
    await user.click(submitButton);

    expect(screen.getByText('Recording...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});