import api from './api';
import {toast} from 'react-toastify'

export const getDashboardInsights = async () => {
  try {
    const { data } = await api.get('/api/ai/insights');
    return data;
  } catch (error) {
    console.error('Failed to get AI insights', error);
    throw error;
  }
};

export const getFarmerSummary = async (farmerId) => {
    try {
      const { data } = await api.get(`/api/ai/farmer-summary/${farmerId}`);
      return data;
    } catch (error) {
      console.error('Failed to get farmer summary', error);
      throw error;
    }
  };


export const getYieldByRegionChart = async () => {
  try {
    const { data } = await api.get('/api/ai/analytics/yield-by-region');    
    return {
      labels: data.labels, // e.g., ['Central', 'Rift Valley']
      datasets: [
        {
          label: 'Total Yield (Kg)',
          data: data.series, // e.g., [5000, 8000]
          backgroundColor: 'rgba(22, 163, 74, 0.6)',
          borderColor: 'rgba(22, 163, 74, 1)',
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Could not fetch regional chart data.');
    throw error;
  }
};

//  Pie chart logic
const backgroundColors = [
  'rgba(22, 163, 74, 0.6)', // Green (Grade A)
  'rgba(234, 179, 8, 0.6)',  // Yellow (Grade B)
  'rgba(249, 115, 22, 0.6)', // Orange (Grade C)
  'rgba(220, 38, 38, 0.6)',  // Red (Reject)
  'rgba(107, 114, 128, 0.6)' // Gray
];

export const getQualityDistributionChart = async () => {
  try {
    const { data } = await api.get('/api/ai/analytics/quality-distribution');   
    // Format for Pie Chart
    return {
      labels: data.labels, // e.g., ['A', 'B', 'C', 'Reject']
      datasets: [
        {
          label: 'Produce Grade',
          data: data.series, // e.g., [1000, 500, 200, 50]
          backgroundColor: backgroundColors.slice(0, data.labels.length),
          borderColor: backgroundColors.map(color => color.replace('0.6', '1')),
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Could not fetch quality data.');
    throw error;
  }
};


export const getCollectionsOverTimeChart = async () => {
  try {
    const { data } = await api.get('/api/ai/analytics/collections-timeseries');    
    // Format for Line Chart
    return {
      labels: data.labels, // e.g., ['2023-01-01', '2023-01-02']
      datasets: [
        {
          label: 'Collections Over Time',
          data: data.series, // e.g., [500, 750]
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        },
      ],
    };
  } catch (error) {
    toast.error(error.response?.data?.message || 'Could not fetch time-series data.');
    throw error;
  }
};


export const getYieldForecast = async () => {
  try {
    const { data } = await api.get('/api/ai/analytics/yield-forecast');
    return data; // e.g., { forecasts: ["Expect maize harvest...", ...] }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Could not fetch AI forecast.');
    throw error;
  }
};