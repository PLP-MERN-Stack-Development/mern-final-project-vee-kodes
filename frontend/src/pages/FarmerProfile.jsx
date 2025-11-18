import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFarmerDetails } from '../services/farmerService';
import { getFarmerSummary } from '../services/aiService';
import {
  SparklesIcon,
  RectangleStackIcon,
  PencilIcon,
  BeakerIcon,
  DocumentTextIcon,
  SunIcon,
  CloudIcon,
  WrenchScrewdriverIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

// Activity icon selector
const getActivityIcon = (type) => {
  switch (type) {
    case 'Planting': return <RectangleStackIcon className="h-5 w-5 text-gray-500" />;
    case 'Fertilizer Application': return <BeakerIcon className="h-5 w-5 text-gray-500" />;
    case 'Pesticide Application':
    case 'Pest Control': return <PencilIcon className="h-5 w-5 text-gray-500" />;
    case 'Weeding': return <SunIcon className="h-5 w-5 text-gray-500" />;
    case 'Irrigation': return <CloudIcon className="h-5 w-5 text-gray-500" />;
    case 'Field Maintenance/General Maintenance': return <WrenchScrewdriverIcon className="h-5 w-5 text-gray-500" />;
    default: return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
  }
};

// Render activity details
const renderActivityDetails = (activity) => {
  switch (activity.type) {
    case 'Planting':
      return (
        <>
          <p className="text-sm text-gray-600">Variety: {activity.seedVariety || '-'}</p>
          <p className="text-sm text-gray-600">Source: {activity.seedSource || '-'}</p>
          <p className="text-sm text-gray-600">Quantity: {activity.seedQuantity || '-'}</p>
          <p className="text-sm text-gray-600">Lot: {activity.seedLotNumber || '-'}</p>
        </>
      );
    case 'Fertilizer Application':
      return (
        <>
          <p className="text-sm text-gray-600">Type: {activity.fertilizerType || '-'}</p>
          <p className="text-sm text-gray-600">Amount: {activity.fertilizerAmount || '-'}</p>
        </>
      );
    case 'Pesticide Application':
      return (
        <>
          <p className="text-sm text-gray-600">Type: {activity.pesticideType || '-'}</p>
          <p className="text-sm text-gray-600">Amount: {activity.pesticideAmount || '-'}</p>
        </>
      );
    case 'Pest Control':
      return (
        <>
          <p className="text-sm text-gray-600">Method: {activity.pestControlMethod || '-'}</p>
          <p className="text-sm text-gray-600">Target: {activity.pestTarget || '-'}</p>
        </>
      );
    case 'Weeding':
    case 'Irrigation':
    case 'Field Maintenance/General Maintenance':
      return <p className="text-sm text-gray-600">Details: {activity.generalDetails || '-'}</p>;
    default:
      return <p className="text-sm text-gray-600">No details available.</p>;
  }
};

export default function FarmerProfile() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getFarmerDetails(id);
        setData(profileData);
        setLoading(false);

        setAiLoading(true);
        const summaryData = await getFarmerSummary(id);
        setSummary(summaryData.summary);
        setAiLoading(false);
      } catch (error) {
        setLoading(false);
        setAiLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading profile...</div>;
  if (!data) return <div>Farmer not found.</div>;

  const { farmer, activities, collections } = data;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/farmers"
          className="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-transform active:scale-95"
        >
          <ArrowLeftIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
          Back
        </Link>
      </div>

      {/* Farmer Info */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{farmer.name}</h2>
        <p className="text-gray-600">{farmer.region} | {farmer.contact}</p>
        <p className="text-gray-600">
          Contracted Crop: <strong>{farmer.contractedCrop}</strong>
        </p>

        <div className="mt-4 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <SparklesIcon className="h-5 w-5 text-blue-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">AI Smart Summary</h3>
              <p className="mt-2 text-sm text-blue-700">{aiLoading ? "Generating..." : summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activities & Collections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Activities */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Farm Activities</h3>
          <ul className="-mb-8">
            {activities.map((act) => (
              <li key={act._id} className="relative pb-8">
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                <div className="relative flex space-x-3">
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                    {getActivityIcon(act.type)}
                  </span>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{act.type}</p>
                      {renderActivityDetails(act)}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {new Date(act.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Collections */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Collections & Payments</h3>
          <ul className="mt-4 divide-y divide-gray-200">
            {collections.map((col) => (
              <li key={col._id} className="flex justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{col.weight} Kg ({col.qualityGrade} Grade)</p>
                  <p className="text-sm text-gray-600">KES {col.totalPayment.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <p className="text-xs text-gray-400">{new Date(col.collectionDate).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  col.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {col.paymentStatus}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
