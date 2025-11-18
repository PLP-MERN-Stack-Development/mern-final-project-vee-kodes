import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { getAllFarmers } from '../services/farmerService';
import { UserIcon } from '@heroicons/react/24/outline';

export default function FarmerList() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams(); 
  const regionFilter = searchParams.get('region');
  const cropFilter = searchParams.get('crop');
  const qualityGradeFilter = searchParams.get('qualityGrade');
  const dateFilter = searchParams.get('collectionDate');


  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const data = await getAllFarmers();
        
        let filteredFarmers = data;
        
        if (regionFilter) {
          filteredFarmers = data.filter(
            (farmer) => farmer.region === regionFilter
          );
        } else if (cropFilter) {
          filteredFarmers = data.filter(
            (farmer) => farmer.contractedCrop === cropFilter
          );
        } else if (qualityGradeFilter) {
          // Fetch all collections
          const collectionsRes = await api.get('/api/collections');
          const allCollections = collectionsRes.data;
          
          // Find all farmer IDs that have a collection with this quality grade
          const farmerIdsWithGrade = new Set(
            allCollections
              .filter(col => col.qualityGrade === qualityGradeFilter)
              .map(col => col.farmer._id) // Note: Assumes collection farmer is populated or just an ID
          );
          
          // Filter the farmers list
          filteredFarmers = data.filter(farmer => farmerIdsWithGrade.has(farmer._id));
        // Add new filter logic for date
        } else if (dateFilter) {
          const collectionsRes = await api.get('/api/collections');
          const allCollections = collectionsRes.data;
          
          const farmerIdsWithDate = new Set(
            allCollections
              // Convert collection's ISO date string to "YYYY-MM-DD" to match the filter
              .filter(col => col.collectionDate.split('T')[0] === dateFilter)
              .map(col => col.farmer._id)
          );          
          filteredFarmers = data.filter(farmer => farmerIdsWithDate.has(farmer._id));
        }        
        setFarmers(filteredFarmers);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, [regionFilter, cropFilter, qualityGradeFilter, dateFilter]); // Add new filter to dependency array

  if (loading) return <div>Loading farmers...</div>;


  // Helper function to create the dynamic title
  const getTitle = () => {
    if (regionFilter) {
      return <>Showing farmers in: <strong className="text-green-600">{regionFilter}</strong></>
    }
    if (cropFilter) {
      return <>Showing farmers contracted for: <strong className="text-green-600">{cropFilter}</strong></>
    }
    if (qualityGradeFilter) {
      return <>Showing farmers with <strong className="text-green-600">Grade {qualityGradeFilter}</strong> collections</>
    }
    if (dateFilter) {
      return <>Showing farmers who had collections on: <strong className="text-green-600">{new Date(dateFilter).toLocaleDateString()}</strong></>
    }
    return "A list of all contracted farmers.";
  };

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">Registered Farmers</h3>
        <p className="mt-1 text-sm text-gray-500">
          {getTitle()}
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {farmers.length === 0 ? (
          <li className="px-4 py-4 text-center text-sm text-gray-500 sm:px-6">
            No farmers found matching this filter.
          </li>
        ) : (
          farmers.map((farmer) => (
            <li key={farmer._id}>
              <Link 
                to={`/farmer/${farmer._id}`} 
                className="block hover:bg-gray-50 transition-all transform hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex min-w-0 flex-1 items-center">
                    <div className="shrink-0">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div>
                        <p className="truncate text-sm font-medium text-green-600">{farmer.name}</p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          {farmer.contact}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <p className="text-sm text-gray-900">Crop: {farmer.contractedCrop}</p>
                        <p className="mt-2 text-sm text-gray-500">
                      Region: {farmer.region}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}