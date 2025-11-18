import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllFarmers, recordCollection } from '../services/farmerService.js';

const qualityGrades = ['A', 'B', 'C', 'Reject'];

export default function RecordCollection() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmerId: '',
    crop: '',
    harvestDate: '',
    collectionDate: new Date().toISOString().split('T')[0],
    weight: '',
    qualityGrade: qualityGrades[0],
    paymentRate: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await getAllFarmers();
        setFarmers(data);
      } catch (error) {
        toast.error('Could not load farmers.');
      }
    };
    fetchFarmers();
  }, []);

  const { farmerId, crop, harvestDate, collectionDate, weight, qualityGrade, paymentRate } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFarmerChange = (e) => {
    const selectedFarmer = farmers.find(f => f._id === e.target.value);
    if (selectedFarmer) {
      setFormData({
        ...formData,
        farmerId: selectedFarmer._id,
        crop: selectedFarmer.contractedCrop,
      });
    }
  };

  const handlePaymentRateChange = (e) => {
    let value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) || value === '') {
      const formatted = value === '' ? '' : Number(value).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      setFormData({ ...formData, paymentRate: formatted });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const collectionData = {
        ...formData,
        weight: parseFloat(weight),
        paymentRate: parseFloat(paymentRate.replace(/,/g, '')), 
      };

      const newCollection = await recordCollection(collectionData);
      toast.success(`Collection of ${newCollection.weight}kg recorded!`);
      navigate(`/farmer/${newCollection.farmer}`); 
    } catch (error) {
      toast.error('Failed to record collection.');
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 sm:px-0">
      <section className="rounded-lg bg-white p-4 sm:p-8 shadow" aria-labelledby="collection-form-heading">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900" id="collection-form-heading">
            Record Harvest
          </h1>
        </header>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="farmerId" className="block text-sm font-medium text-gray-700">Select Farmer</label>
            <select
              name="farmerId"
              id="farmerId"
              value={farmerId}
              onChange={handleFarmerChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]"
            >
              <option value="" disabled>-- Select a farmer --</option>
              {farmers.map(farmer => (
                <option key={farmer._id} value={farmer._id}>
                  {farmer.name} - {farmer.region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-gray-700">Crop</label>
            <input type="text" name="crop" id="crop" value={crop} onChange={onChange} required 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm read-only:bg-gray-100 focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]" 
                   readOnly 
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700">Harvest Date</label>
              <input type="date" name="harvestDate" id="harvestDate" value={harvestDate} onChange={onChange} required 
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]"
              />
            </div>
            <div>
              <label htmlFor="collectionDate" className="block text-sm font-medium text-gray-700">Collection Date</label>
              <input type="date" name="collectionDate" id="collectionDate" value={collectionDate} onChange={onChange} required 
                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (in Kg)</label>
            <input type="number" step="0.01" name="weight" id="weight" value={weight} onChange={onChange} required placeholder="500.5" 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qualityGrade" className="block text-sm font-medium text-gray-700">Quality Grade</label>
              <select name="qualityGrade" id="qualityGrade" value={qualityGrade} onChange={onChange} required 
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]"
              >
                {qualityGrades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="paymentRate" className="block text-sm font-medium text-gray-700">Payment Rate (KES per Kg)</label>
              <input 
                type="text" 
                name="paymentRate" 
                id="paymentRate" 
                value={paymentRate} 
                onChange={handlePaymentRateChange} 
                required 
                placeholder="25.50" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-1 transition focus:scale-[1.02]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 transition-transform active:scale-95"
          >
            {loading ? 'Recording...' : 'Record Collection'}
          </button>
        </form>
      </section>
    </main>
  );
}
