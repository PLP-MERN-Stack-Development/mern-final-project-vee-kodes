import { render, screen } from '@testing-library/react';
import LineChart from './LineChart.jsx';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Line: ({ data, options, onClick, ref }) => (
    <div data-testid="line-chart" data-data={JSON.stringify(data)} data-options={JSON.stringify(options)} onClick={onClick} ref={ref}>
      Mock Line Chart
    </div>
  ),
  getElementAtEvent: jest.fn(),
}));

describe('LineChart', () => {
  const mockData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Revenue',
      data: [100, 200, 300],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    }],
  };

  const mockTitle = 'Monthly Revenue';

  test('renders title', () => {
    render(<LineChart data={mockData} title={mockTitle} />);
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  test('renders chart container', () => {
    render(<LineChart data={mockData} title={mockTitle} />);
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  test('passes data and options to chart', () => {
    render(<LineChart data={mockData} title={mockTitle} />);
    const chart = screen.getByTestId('line-chart');
    expect(chart).toHaveAttribute('data-data', JSON.stringify(mockData));
  });

  test('calls onClick when provided and chart is clicked', () => {
    const mockOnClick = jest.fn();
    render(<LineChart data={mockData} title={mockTitle} onClick={mockOnClick} />);

    const chart = screen.getByTestId('line-chart');
    // Mock getElementAtEvent to return an element
    const { getElementAtEvent } = require('react-chartjs-2');
    getElementAtEvent.mockReturnValue([{ index: 1 }]);

    // Simulate click
    chart.click();

    expect(mockOnClick).toHaveBeenCalledWith(1);
  });

  test('does not call onClick when not provided', () => {
    const mockOnClick = jest.fn();
    render(<LineChart data={mockData} title={mockTitle} />);

    const chart = screen.getByTestId('line-chart');
    chart.click();

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});