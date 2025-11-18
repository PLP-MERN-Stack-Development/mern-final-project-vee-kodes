import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login.jsx';

// Mock the AuthContext
const mockLogin = jest.fn();
const mockUseAuth = jest.fn();
const mockUseNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate(),
  useLocation: () => mockUseLocation(),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderLogin = (user = null) => {
  mockUseAuth.mockReturnValue({
    user,
    login: mockLogin,
  });
  mockUseLocation.mockReturnValue({ pathname: '/login' });

  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByText('Sign in to your Account')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  test('updates form data on input change', async () => {
    const user = userEvent.setup();
    renderLogin();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: '' }); // The eye icon button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('submits form and calls login', async () => {
    const user = userEvent.setup();
    const mockUserData = { name: 'Test User', role: 'Admin' };
    mockLogin.mockResolvedValue(mockUserData);

    renderLogin();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password');
    });

    expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  test('handles login error', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Invalid credentials'));

    renderLogin();

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
    });

    // Button should not be disabled after error
    expect(submitButton).not.toBeDisabled();
  });

  test('redirects if user is already logged in', () => {
    const loggedInUser = { name: 'Existing User', role: 'Admin' };
    renderLogin(loggedInUser);

    expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('shows loading state during submission', async () => {
    const user = userEvent.setup();
    mockLogin.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ name: 'User', role: 'Admin' }), 100)));

    renderLogin();

    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(submitButton);

    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
});