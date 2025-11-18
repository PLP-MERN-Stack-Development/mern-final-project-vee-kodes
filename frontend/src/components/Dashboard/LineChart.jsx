import React, { useRef } from 'react'; 
import { Line, getElementAtEvent } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Add 'onClick' prop
const LineChart = ({ data, title, onClick }) => {
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
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Add click handler
  const handleClick = (event) => {
    if (!onClick) return;
    const element = getElementAtEvent(chartRef.current, event);
    if (!element.length) return;
    onClick(element[0].index);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      <div className="mt-4 relative h-80" role="img" aria-label={`${title} line chart showing ${data.datasets[0].label} data`}>
        {/* Pass ref and handler to Line component */}
        <Line
          ref={chartRef}
          data={data}
          options={options}
          onClick={handleClick}
        />
      </div>
    </div>
  );
};

export default LineChart;