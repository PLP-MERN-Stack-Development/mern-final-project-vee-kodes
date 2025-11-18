import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar.jsx';

// Mock the AuthContext
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

const renderNavbar = (user = null) => {
  mockUseAuth.mockReturnValue({
    user,
    logout: jest.fn(),
  });
  mockUseLocation.mockReturnValue({ pathname: '/' });

  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders logo and brand name', () => {
    renderNavbar();
    expect(screen.getByText('AgriTrace AI')).toBeInTheDocument();
  });

  test('renders public links when not logged in', () => {
    renderNavbar();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('For Your Team')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders admin navigation when user is Admin', () => {
    const adminUser = { name: 'Admin User', role: 'Admin' };
    renderNavbar(adminUser);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Farmers')).toBeInTheDocument();
    expect(screen.getByText('Register Farmer')).toBeInTheDocument();
    expect(screen.getByText('Produce Intake')).toBeInTheDocument();
    expect(screen.getByText('Log Farm Operation')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Admin User (Admin)')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('renders field officer navigation when user is FieldOfficer', () => {
    const foUser = { name: 'Field Officer', role: 'FieldOfficer' };
    renderNavbar(foUser);
    expect(screen.getByText('Farmers')).toBeInTheDocument();
    expect(screen.getByText('Register Farmer')).toBeInTheDocument();
    expect(screen.getByText('Produce Intake')).toBeInTheDocument();
    expect(screen.getByText('Log Farm Operation')).toBeInTheDocument();
    expect(screen.getByText('Welcome, Field Officer (FieldOfficer)')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('does not render admin dashboard for FieldOfficer', () => {
    const foUser = { name: 'Field Officer', role: 'FieldOfficer' };
    renderNavbar(foUser);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  test('handles logout', () => {
    const adminUser = { name: 'Admin User', role: 'Admin' };
    const mockLogout = jest.fn();
    mockUseAuth.mockReturnValue({
      user: adminUser,
      logout: mockLogout,
    });

    renderNavbar(adminUser);
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockUseNavigate).toHaveBeenCalledWith('/login');
  });

  test('toggles mobile menu', () => {
    renderNavbar();
    const menuButton = screen.getByRole('button', { hidden: true }); // Hamburger menu
    fireEvent.click(menuButton);

    // Check if mobile menu items are visible
    expect(screen.getByText('Home')).toBeInTheDocument(); // Should be visible in mobile menu
  });

  test('highlights active link', () => {
    mockUseLocation.mockReturnValue({ pathname: '/about' });
    renderNavbar();

    const aboutLink = screen.getByText('About Us');
    expect(aboutLink).toHaveClass('border-b-2', 'border-green-500', 'text-white');
  });
});