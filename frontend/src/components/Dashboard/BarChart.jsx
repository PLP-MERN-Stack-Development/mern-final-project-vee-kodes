import React, { useRef } from 'react';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Reusable Bar Chart component
const BarChart = ({ data, title, onClick }) => {
  const chartRef = useRef();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: title,
      },
    },
  };

  // Handles the click event on the chart
  const handleClick = (event) => {
    // Check if the onClick prop was passed
    if (!onClick) return;

    // Get the chart element that was clicked
    const element = getElementAtEvent(chartRef.current, event);

    // If no element was clicked (e.g., clicked on empty space), do nothing
    if (!element.length) return;

    // Call the onClick function passed from the parent (Dashboard.jsx)
    // and send back the index of the bar that was clicked
    onClick(element[0].index);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      <div className="mt-4 relative h-80" role="img" aria-label={`${title} bar chart showing ${data.datasets[0].label} data`}>
        <Bar
          ref={chartRef}
          data={data}
          options={options}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default BarChart;