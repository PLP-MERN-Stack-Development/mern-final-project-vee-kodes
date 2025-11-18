import { render, screen } from '@testing-library/react';
import PieChart from './PieChart.jsx';

// Mock react-chartjs-2
jest.mock('react-chartjs-2', () => ({
  Pie: ({ data, options, onClick, ref }) => (
    <div data-testid="pie-chart" data-data={JSON.stringify(data)} data-options={JSON.stringify(options)} onClick={onClick} ref={ref}>
      Mock Pie Chart
    </div>
  ),
  getElementAtEvent: jest.fn(),
}));

describe('PieChart', () => {
  const mockData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      label: 'Votes',
      data: [12, 19, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 205, 86, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 205, 86, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const mockTitle = 'Vote Distribution';

  test('renders title', () => {
    render(<PieChart data={mockData} title={mockTitle} />);
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  test('renders chart container', () => {
    render(<PieChart data={mockData} title={mockTitle} />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('passes data and options to chart', () => {
    render(<PieChart data={mockData} title={mockTitle} />);
    const chart = screen.getByTestId('pie-chart');
    expect(chart).toHaveAttribute('data-data', JSON.stringify(mockData));
  });

  test('calls onClick when provided and chart is clicked', () => {
    const mockOnClick = jest.fn();
    render(<PieChart data={mockData} title={mockTitle} onClick={mockOnClick} />);

    const chart = screen.getByTestId('pie-chart');
    // Mock getElementAtEvent to return an element
    const { getElementAtEvent } = require('react-chartjs-2');
    getElementAtEvent.mockReturnValue([{ index: 2 }]);

    // Simulate click
    chart.click();

    expect(mockOnClick).toHaveBeenCalledWith(2);
  });

  test('does not call onClick when not provided', () => {
    const mockOnClick = jest.fn();
    render(<PieChart data={mockData} title={mockTitle} />);

    const chart = screen.getByTestId('pie-chart');
    chart.click();

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});