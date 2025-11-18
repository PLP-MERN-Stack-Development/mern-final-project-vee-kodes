import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddActivity from './AddActivity.jsx';

// Mock farmerService
const mockGetAllFarmers = jest.fn();
const mockAddFarmActivity = jest.fn();
jest.mock('../services/farmerService', () => ({
  getAllFarmers: mockGetAllFarmers,
  addFarmActivity: mockAddFarmActivity,
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

const renderAddActivity = () => {
  return render(
    <BrowserRouter>
      <AddActivity />
    </BrowserRouter>
  );
};

describe('AddActivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllFarmers.mockResolvedValue([
      { _id: '1', name: 'Farmer One', region: 'Central' },
      { _id: '2', name: 'Farmer Two', region: 'Coast' },
    ]);
  });

  test('renders form and fetches farmers', async () => {
    renderAddActivity();
    expect(screen.getByText('Record Farm Operations')).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAllFarmers).toHaveBeenCalled();
    });

    expect(screen.getByText('Farmer One - Central')).toBeInTheDocument();
    expect(screen.getByText('Farmer Two - Coast')).toBeInTheDocument();
  });

  test('shows conditional fields when operation type is selected', async () => {
    const user = userEvent.setup();
    renderAddActivity();

    const typeSelect = screen.getByLabelText('Operation Type');
    await user.selectOptions(typeSelect, 'Planting');

    expect(screen.getByText('Seed Variety')).toBeInTheDocument();
    expect(screen.getByText('Seed Source')).toBeInTheDocument();
    expect(screen.getByText('Seed Quantity')).toBeInTheDocument();
    expect(screen.getByText('Seed Lot Number')).toBeInTheDocument();
  });

  test('shows different fields for Fertilizer Application', async () => {
    const user = userEvent.setup();
    renderAddActivity();

    const typeSelect = screen.getByLabelText('Operation Type');
    await user.selectOptions(typeSelect, 'Fertilizer Application');

    expect(screen.getByText('Fertilizer Type')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  test('shows general details for Weeding', async () => {
    const user = userEvent.setup();
    renderAddActivity();

    const typeSelect = screen.getByLabelText('Operation Type');
    await user.selectOptions(typeSelect, 'Weeding');

    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    renderAddActivity();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    await user.click(submitButton);

    expect(screen.getByText('Please select farmer and operation type.')).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const user = userEvent.setup();
    const mockActivity = { farmer: '1' };
    mockAddFarmActivity.mockResolvedValue(mockActivity);

    renderAddActivity();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const typeSelect = screen.getByLabelText('Operation Type');
    const dateInput = screen.getByLabelText('Activity Date');
    const costInput = screen.getByLabelText('Cost (KES, optional)');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.selectOptions(farmerSelect, '1');
    await user.selectOptions(typeSelect, 'Planting');
    await user.clear(dateInput);
    await user.type(dateInput, '2023-10-01');
    await user.type(costInput, '1500');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddFarmActivity).toHaveBeenCalledWith({
        farmerId: '1',
        type: 'Planting',
        date: '2023-10-01',
        cost: 1500,
        seedVariety: '',
        seedSource: '',
        seedQuantity: '',
        seedLotNumber: '',
        fertilizerType: '',
        fertilizerAmount: '',
        pesticideType: '',
        pesticideAmount: '',
        pestControlMethod: '',
        pestTarget: '',
        generalDetails: '',
      });
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/farmer/1');
  });

  test('handles submission error', async () => {
    const user = userEvent.setup();
    mockAddFarmActivity.mockRejectedValue(new Error('Submission failed'));

    renderAddActivity();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const typeSelect = screen.getByLabelText('Operation Type');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.selectOptions(farmerSelect, '1');
    await user.selectOptions(typeSelect, 'Weeding');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddFarmActivity).toHaveBeenCalled();
    });

    expect(screen.getByText('Failed to log activity.')).toBeInTheDocument();
  });

  test('shows loading state', async () => {
    const user = userEvent.setup();
    mockAddFarmActivity.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ farmer: '1' }), 100)));

    renderAddActivity();

    const farmerSelect = screen.getByLabelText('Select Farmer');
    const typeSelect = screen.getByLabelText('Operation Type');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    await user.selectOptions(farmerSelect, '1');
    await user.selectOptions(typeSelect, 'Irrigation');
    await user.click(submitButton);

    expect(screen.getByText('Submitting...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});