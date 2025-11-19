import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RecordCollection from './RecordCollection.jsx';

// Mock farmerService
jest.mock('../services/farmerService', () => ({
  getAllFarmers: jest.fn(),
  recordCollection: jest.fn(),
}));

const { getAllFarmers: mockGetAllFarmers, recordCollection: mockRecordCollection } = require('../services/farmerService');

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

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Farmer One - Central' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Farmer Two - Coast' })).toBeInTheDocument();
    });
  });
});