// Mock import.meta.env
global.import = global.import || {};
global.import.meta = {
  env: {
    VITE_API_URL: 'http://localhost:5000',
  },
};

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterFarmer from './RegisterFarmer.jsx';

// Mock farmerService
jest.mock('../services/farmerService', () => ({
  registerFarmer: jest.fn(),
}));

const { registerFarmer: mockRegisterFarmer } = require('../services/farmerService');

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

const renderRegisterFarmer = () => {
  return render(
    <BrowserRouter>
      <RegisterFarmer />
    </BrowserRouter>
  );
};

describe('RegisterFarmer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form', () => {
    renderRegisterFarmer();
    expect(screen.getByText('Register New Farmer')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Region')).toBeInTheDocument();
    expect(screen.getByLabelText('Contact (Phone)')).toBeInTheDocument();
    expect(screen.getByLabelText('Contracted Crop')).toBeInTheDocument();
    expect(screen.getByLabelText('Contract ID')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register Farmer' })).toBeInTheDocument();
  });


  test('selects region from dropdown', async () => {
    const user = userEvent.setup();
    renderRegisterFarmer();

    const regionSelect = screen.getByLabelText('Region');
    await user.selectOptions(regionSelect, 'Central');

    expect(regionSelect.value).toBe('Central');
  });




});