import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterFarmer from './RegisterFarmer.jsx';

// Mock farmerService
const mockRegisterFarmer = jest.fn();
jest.mock('../services/farmerService', () => ({
  registerFarmer: mockRegisterFarmer,
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

  test('updates form data on input change', async () => {
    const user = userEvent.setup();
    renderRegisterFarmer();

    const nameInput = screen.getByLabelText('Name');
    const contactInput = screen.getByLabelText('Contact (Phone)');
    const cropInput = screen.getByLabelText('Contracted Crop');
    const contractIdInput = screen.getByLabelText('Contract ID');

    await user.type(nameInput, 'John Doe');
    await user.type(contactInput, '1234567890');
    await user.type(cropInput, 'Maize');
    await user.type(contractIdInput, 'CON123');

    expect(nameInput.value).toBe('John Doe');
    expect(contactInput.value).toBe('1234567890');
    expect(cropInput.value).toBe('Maize');
    expect(contractIdInput.value).toBe('CON123');
  });

  test('selects region from dropdown', async () => {
    const user = userEvent.setup();
    renderRegisterFarmer();

    const regionSelect = screen.getByLabelText('Region');
    await user.selectOptions(regionSelect, 'Central');

    expect(regionSelect.value).toBe('Central');
  });

  test('shows error if region not selected', async () => {
    const user = userEvent.setup();
    renderRegisterFarmer();

    const submitButton = screen.getByRole('button', { name: 'Register Farmer' });
    await user.click(submitButton);

    expect(screen.getByText('Please select a region.')).toBeInTheDocument();
  });

  test('submits form and registers farmer', async () => {
    const user = userEvent.setup();
    const mockFarmer = { _id: '123', name: 'John Doe' };
    mockRegisterFarmer.mockResolvedValue(mockFarmer);

    renderRegisterFarmer();

    const nameInput = screen.getByLabelText('Name');
    const regionSelect = screen.getByLabelText('Region');
    const contactInput = screen.getByLabelText('Contact (Phone)');
    const cropInput = screen.getByLabelText('Contracted Crop');
    const contractIdInput = screen.getByLabelText('Contract ID');
    const submitButton = screen.getByRole('button', { name: 'Register Farmer' });

    await user.type(nameInput, 'John Doe');
    await user.selectOptions(regionSelect, 'Central');
    await user.type(contactInput, '1234567890');
    await user.type(cropInput, 'Maize');
    await user.type(contractIdInput, 'CON123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterFarmer).toHaveBeenCalledWith({
        name: 'John Doe',
        region: 'Central',
        contact: '1234567890',
        contractedCrop: 'Maize',
        contractId: 'CON123',
      });
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/farmer/123');
  });

  test('handles registration error', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Registration failed';
    mockRegisterFarmer.mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    renderRegisterFarmer();

    const nameInput = screen.getByLabelText('Name');
    const regionSelect = screen.getByLabelText('Region');
    const contactInput = screen.getByLabelText('Contact (Phone)');
    const cropInput = screen.getByLabelText('Contracted Crop');
    const submitButton = screen.getByRole('button', { name: 'Register Farmer' });

    await user.type(nameInput, 'John Doe');
    await user.selectOptions(regionSelect, 'Central');
    await user.type(contactInput, '1234567890');
    await user.type(cropInput, 'Maize');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockRegisterFarmer).toHaveBeenCalled();
    });

    // Button should not be disabled after error
    expect(submitButton).not.toBeDisabled();
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    mockRegisterFarmer.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ _id: '123', name: 'John' }), 100)));

    renderRegisterFarmer();

    const nameInput = screen.getByLabelText('Name');
    const regionSelect = screen.getByLabelText('Region');
    const contactInput = screen.getByLabelText('Contact (Phone)');
    const cropInput = screen.getByLabelText('Contracted Crop');
    const submitButton = screen.getByRole('button', { name: 'Register Farmer' });

    await user.type(nameInput, 'John Doe');
    await user.selectOptions(regionSelect, 'Central');
    await user.type(contactInput, '1234567890');
    await user.type(cropInput, 'Maize');
    await user.click(submitButton);

    expect(screen.getByText('Registering...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});