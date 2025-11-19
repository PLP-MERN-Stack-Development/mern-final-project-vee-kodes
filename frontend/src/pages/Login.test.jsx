import { render, screen, waitFor, act } from '@testing-library/react';
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
  useNavigate: () => mockUseNavigate,
  useLocation: () => mockUseLocation,
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


  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();

    const passwordInput = screen.getByLabelText('Password');
    const toggleButton = screen.getByRole('button', { name: 'Show password' }); // The eye icon button

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });



  test('redirects if user is already logged in', () => {
    const loggedInUser = { name: 'Existing User', role: 'Admin' };
    renderLogin(loggedInUser);

    expect(mockUseNavigate).toHaveBeenCalledWith('/dashboard');
  });

});