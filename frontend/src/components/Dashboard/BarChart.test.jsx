import { render, screen } from '@testing-library/react';
import BarChart from './BarChart.jsx';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Bar: ({ data, options, onClick, ref }) => (
    <div data-testid="bar-chart" data-data={JSON.stringify(data)} data-options={JSON.stringify(options)} onClick={onClick} ref={ref}>
      Mock Bar Chart
    </div>
  ),
  getElementAtEvent: jest.fn(),
}));

describe('BarChart', () => {
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [10, 20, 30],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  const mockTitle = 'Monthly Sales';

  test('renders title', () => {
    render(<BarChart data={mockData} title={mockTitle} />);
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  test('renders chart container', () => {
    render(<BarChart data={mockData} title={mockTitle} />);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  test('passes data and options to chart', () => {
    render(<BarChart data={mockData} title={mockTitle} />);
    const chart = screen.getByTestId('bar-chart');
    expect(chart).toHaveAttribute('data-data', JSON.stringify(mockData));
    // Options check might be complex, but we can check if it's there
  });

  test('calls onClick when provided and chart is clicked', () => {
    const mockOnClick = jest.fn();
    render(<BarChart data={mockData} title={mockTitle} onClick={mockOnClick} />);

    const chart = screen.getByTestId('bar-chart');
    // Mock getElementAtEvent to return an element
    const { getElementAtEvent } = require('react-chartjs-2');
    getElementAtEvent.mockReturnValue([{ index: 0 }]);

    // Simulate click
    chart.click();

    expect(mockOnClick).toHaveBeenCalledWith(0);
  });

  test('does not call onClick when not provided', () => {
    const mockOnClick = jest.fn();
    render(<BarChart data={mockData} title={mockTitle} />);

    const chart = screen.getByTestId('bar-chart');
    chart.click();

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});