import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AddActivity from './AddActivity.jsx';

// Mock farmerService
jest.mock('../services/farmerService', () => ({
  getAllFarmers: jest.fn(),
  addFarmActivity: jest.fn(),
}));

const { getAllFarmers: mockGetAllFarmers, addFarmActivity: mockAddFarmActivity } = require('../services/farmerService');

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

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Farmer One - Central' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Farmer Two - Coast' })).toBeInTheDocument();
    });
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




});