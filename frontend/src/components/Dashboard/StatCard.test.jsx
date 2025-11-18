import { render, screen } from '@testing-library/react';
import StatCard from './StatCard.jsx';

describe('StatCard', () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>;
  const mockTitle = 'Total Farmers';
  const mockValue = '150';

  test('renders title', () => {
    render(<StatCard title={mockTitle} value={mockValue} icon={mockIcon} />);
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  test('renders value', () => {
    render(<StatCard title={mockTitle} value={mockValue} icon={mockIcon} />);
    expect(screen.getByText(mockValue)).toBeInTheDocument();
  });

  test('renders icon', () => {
    render(<StatCard title={mockTitle} value={mockValue} icon={mockIcon} />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<StatCard title={mockTitle} value={mockValue} icon={mockIcon} />);
    const card = container.firstChild;
    expect(card).toHaveClass('overflow-hidden', 'rounded-lg', 'bg-white', 'px-4', 'py-5', 'shadow', 'sm:p-6');
  });
});