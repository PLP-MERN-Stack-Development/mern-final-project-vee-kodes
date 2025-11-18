import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, CurrencyDollarIcon, CubeIcon, SparklesIcon, ScaleIcon, BanknotesIcon, BeakerIcon, 
  LightBulbIcon, ExclamationTriangleIcon, CheckCircleIcon,
  ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import StatCard from '../components/Dashboard/StatCard';
import BarChart from '../components/Dashboard/BarChart'; 
import PieChart from '../components/Dashboard/PieChart';
import LineChart from '../components/Dashboard/LineChart';
import { 
  getDashboardInsights, 
  getYieldByRegionChart, 
  getQualityDistributionChart,
  getCollectionsOverTimeChart,
  getYieldForecast 
} from '../services/aiService';
import api from '../services/api';


const processCropData = (collections) => {
  const cropData = collections.reduce((acc, curr) => {
    const crop = curr.crop;
    if (!acc[crop]) {
      acc[crop] = 0;
    }
    acc[crop] += curr.weight;
    return acc;
  }, {});

  return {
    labels: Object.keys(cropData),
    datasets: [
      {
        label: 'Total Weight Collected (Kg)',
        data: Object.values(cropData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };
};

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    farmers: 0, 
    collected: 0, 
    paid: 0,
    outstanding: 0,
    avgCost: 0,
  });
  const [aiInsights, setAiInsights] = useState([]);
  const [cropYieldData, setCropYieldData] = useState(null);
  const [regionalYieldData, setRegionalYieldData] = useState(null);
  const [qualityChartData, setQualityChartData] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  const [forecastData, setForecastData] = useState(null); 
  const [forecastLoading, setForecastLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [farmersRes, collectionsRes] = await Promise.all([
          api.get('/api/farmers'),
          api.get('/api/collections'),
        ]);
        const farmers = farmersRes.data;
        const collectionsData = collectionsRes.data;
        const totalCollected = collectionsData.reduce((acc, c) => acc + c.weight, 0);
        const totalPaid = collectionsData
          .filter((c) => c.paymentStatus === 'Paid')
          .reduce((acc, c) => acc + c.totalPayment, 0);
        const outstandingPayments = collectionsData
          .filter((c) => c.paymentStatus === 'Pending')
          .reduce((acc, c) => acc + c.totalPayment, 0);
        const avgCostPerKg = totalCollected > 0 
          ? (totalPaid + outstandingPayments) / totalCollected 
          : 0;
        setStats({
          farmers: farmers.length,
          collected: totalCollected.toFixed(0),
          paid: totalPaid.toFixed(2),
          outstanding: outstandingPayments.toFixed(2),
          avgCost: avgCostPerKg.toFixed(2),
        });
        setCropYieldData(processCropData(collectionsData));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoading(false);
      }
    };

    const fetchAiInsights = async () => {
      try {
          setAiLoading(true);
          const data = await getDashboardInsights();
          setAiInsights(data.insights || []);
          setAiLoading(false);
      } catch (error) {
          console.error("Failed to load AI insights.", error);
          setAiInsights([]);
          setAiLoading(false);
      }
    };

    const fetchRegionalChartData = async () => {
      try {
        const chartData = await getYieldByRegionChart();
        setRegionalYieldData(chartData);
      } catch (error) {
        console.error("Failed to load regional chart data.", error);
      }
    };

    const fetchQualityChartData = async () => {
      try {
        const chartData = await getQualityDistributionChart();
        setQualityChartData(chartData);
      } catch (error) {
        console.error("Failed to load quality chart data.", error);
      }
    };

    const fetchTimeSeriesData = async () => {
      try {
        const chartData = await getCollectionsOverTimeChart();
        setTimeSeriesData(chartData);
      } catch (error) {
        console.error("Failed to load time-series data.", error);
      }
    };

    const fetchYieldForecast = async () => {
      try {
        setForecastLoading(true);
        const data = await getYieldForecast();
        setForecastData(data);
        setForecastLoading(false);
      } catch (error) {
        console.error("Failed to load yield forecast.", error);
        setForecastData(null);
        setForecastLoading(false);
      }
    };

    fetchData();
    fetchAiInsights();
    fetchRegionalChartData();
    fetchQualityChartData();
    fetchTimeSeriesData();
    fetchYieldForecast(); 
  }, []);
  
  const handleRegionClick = (index) => {
    if (!regionalYieldData) return;   
    const regionName = regionalYieldData.labels[index];    
    navigate(`/farmers?region=${regionName}`);
  };

  const handleCropClick = (index) => {
    if (!cropYieldData) return;    
    const cropName = cropYieldData.labels[index];    
    navigate(`/farmers?crop=${cropName}`);
  };

  const handleQualityClick = (index) => {
    if (!qualityChartData) return;    
    const gradeName = qualityChartData.labels[index];    
    navigate(`/farmers?qualityGrade=${gradeName}`);
  };

  const handleDateClick = (index) => {
    if (!timeSeriesData) return;    
    const date = timeSeriesData.labels[index];    
    navigate(`/farmers?collectionDate=${date}`);
  };

  // Add/remove 'is-printing' to hide elements
  const handlePrintPDF = async () => {
    setIsPrinting(true);
    const input = document.getElementById('dashboard-to-print');
    
    // Add 'is-printing' class to the dashboard
    input.classList.add('is-printing');
    
    const canvas = await html2canvas(input, {
      scale: 2, 
      useCORS: true,
    });
    
    // Remove the class immediately after the screenshot
    input.classList.remove('is-printing');
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape', 
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    
    const date = new Date().toISOString().split('T')[0];
    pdf.save(`agritrace_dashboard_${date}.pdf`);
    setIsPrinting(false);
  };


  return (
    // Has the ID and the conditional class
    <main
      id="dashboard-to-print"
      className={`p-4 md:p-8 bg-gray-50 min-h-screen ${isPrinting ? 'is-printing' : ''}`}
    >

      {/* Has'no-print' class */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 no-print">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Manager Dashboard
        </h1>
        <button
          type="button"
          onClick={handlePrintPDF}
          disabled={isPrinting}
          className="inline-flex mt-4 sm:mt-0 items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          aria-label={isPrinting ? 'Generating PDF report' : 'Print dashboard report'}
        >
          <ArrowDownOnSquareIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          {isPrinting ? 'Generating PDF...' : 'Print Report'}
        </button>
      </header>

      {/* Stats Grid */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Dashboard Statistics</h2>
        <dl className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            title="Total Farmers"
            value={stats.farmers.toLocaleString('en-KE')}
            icon={<UserGroupIcon className="h-8 w-8 text-gray-400" />}
          />
          <StatCard
            title="Total Collected (Kg)"
            value={stats.collected.toLocaleString('en-KE')}
            icon={<CubeIcon className="h-8 w-8 text-gray-400" />}
          />
          <StatCard
            title="Avg. Cost (KES/Kg)"
            value={stats.avgCost.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            icon={<ScaleIcon className="h-8 w-8 text-gray-400" />}
          />
          <StatCard
            title="Total Paid (KES)"
            value={`~${Number(stats.paid).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={<CurrencyDollarIcon className="h-8 w-8 text-gray-400" />}
          />
          <StatCard
            title="Outstanding (KES)"
            value={Number(stats.outstanding).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            icon={<BanknotesIcon className="h-8 w-8 text-gray-400" />}
          />
        </dl>
      </section>

      {/* 2x2 Charts Grid */}
      <section aria-labelledby="charts-heading">
        <h2 id="charts-heading" className="sr-only">Data Visualizations</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {timeSeriesData ? (
          <LineChart 
            data={timeSeriesData} 
            title="Collections Over Time" 
            onClick={handleDateClick} 
          />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">Loading Supply Trend...</div>
        )}

        {qualityChartData ? (
          <PieChart 
            data={qualityChartData} 
            title="Yield by Quality Grade" 
            onClick={handleQualityClick} 
          />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">Loading Quality Chart...</div>
        )}
        
        {regionalYieldData ? (
          <BarChart 
            data={regionalYieldData} 
            title="Yield by Region" 
            onClick={handleRegionClick} 
          />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">Loading Regional Chart...</div>
        )}
        
        {cropYieldData ? (
          <BarChart 
            data={cropYieldData} 
            title="Yield by Crop" 
            onClick={handleCropClick}
          />
        ) : (
          <div className="rounded-lg bg-white p-6 shadow">Loading Crop Chart...</div>
        )}
        </div>
      </section>

      {/* 'no-print' class */}
      <section aria-labelledby="insights-heading" className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 no-print">
        <h2 id="insights-heading" className="sr-only">AI Insights</h2>
        {/* Card 1: General AI Insights */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-start">
                <div className="shrink-0"><SparklesIcon className="h-8 w-8 text-blue-500" /></div>
                <div className="ml-5 w-0 flex-1">
                    <dt className="truncate text-sm font-medium text-gray-500">General AI Insights</dt>
                    {aiLoading ? ( <dd className="text-sm text-gray-700 italic mt-1">Generating...</dd> ) : (
                        <dd className="mt-2 text-sm text-gray-700">
                          {aiInsights.length > 0 ? (
                            <ul className="list-disc space-y-1 pl-5">
                              {aiInsights.map((insight, index) => ( <li key={index}>{insight}</li> ))}
                            </ul>
                          ) : ( <p className="italic">No new insights available.</p> )}
                        </dd>
                    )}
                </div>
            </div>
        </div>
        
        {/* Card 2: AI Yield Forecast */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
            <div className="flex items-start">
                <div className="shrink-0"><BeakerIcon className="h-8 w-8 text-purple-500" /></div>
                <div className="ml-5 w-0 flex-1">
                    <dt className="truncate text-sm font-medium text-gray-500">AI Yield Forecast (Next 90 Days)</dt>
                    {forecastLoading ? ( 
                      <dd className="text-sm text-gray-700 italic mt-1">Generating forecast...</dd> 
                    ) : (
                        <dd className="mt-2 text-sm text-gray-700 space-y-4">
                          {forecastData?.notes ? (
                            <p className="italic">{forecastData.notes}</p>
                          ) : (
                            <>
                              {forecastData?.forecasts?.length > 0 && (
                                <div className="flex">
                                  <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500 mr-2" />
                                  <div>
                                    <span className="font-semibold">Forecast:</span>
                                    <ul className="list-none pl-0 space-y-1">
                                      {forecastData.forecasts.map((forecast, i) => (
                                        <li key={i}>{forecast}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                              
                              {forecastData?.keyRisks?.length > 0 && (
                                <div className="flex">
                                  <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-yellow-500 mr-2" />
                                  <div>
                                    <span className="font-semibold">Key Risks:</span>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {forecastData.keyRisks.map((risk, i) => (
                                        <li key={i}>{risk}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}

                              {forecastData?.opportunities?.length > 0 && (
                                <div className="flex">
                                  <LightBulbIcon className="h-5 w-5 shrink-0 text-blue-500 mr-2" />
                                  <div>
                                    <span className="font-semibold">Opportunities:</span>
                                    <ul className="list-disc pl-5 space-y-1">
                                      {forecastData.opportunities.map((op, i) => (
                                        <li key={i}>{op}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </dd>
                    )}
                </div>
            </div>
        </div>

      </section>
    </main>
  );
}