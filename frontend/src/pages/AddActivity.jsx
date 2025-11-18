import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllFarmers, addFarmActivity } from '../services/farmerService.js';

const activityTypes = [
  'Planting',
  'Fertilizer Application',
  'Pesticide Application',
  'Pest Control',
  'Weeding',
  'Irrigation',
  'Field Maintenance/General Maintenance',
];

export default function AddActivity() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    farmerId: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    cost: '',
    seedVariety: '',
    seedSource: '',
    seedQuantity: '',
    seedLotNumber: '',
    fertilizerType: '',
    fertilizerAmount: '',
    pesticideType: '',
    pesticideAmount: '',
    pestControlMethod: '',
    pestTarget: '',
    generalDetails: '',
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

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!formData.farmerId || !formData.type) {
      toast.error('Please select farmer and operation type.');
      return;
    }

    setLoading(true);

    try {
      const activityData = {
        farmerId: formData.farmerId,
        type: formData.type,
        date: formData.date,
        cost: formData.cost ? parseFloat(formData.cost) : 0,

        // fields for all activity types
        seedVariety: formData.seedVariety,
        seedSource: formData.seedSource,
        seedQuantity: formData.seedQuantity,
        seedLotNumber: formData.seedLotNumber,
        fertilizerType: formData.fertilizerType,
        fertilizerAmount: formData.fertilizerAmount,
        pesticideType: formData.pesticideType,
        pesticideAmount: formData.pesticideAmount,
        pestControlMethod: formData.pestControlMethod,
        pestTarget: formData.pestTarget,
        generalDetails: formData.generalDetails,
      };

      const newActivity = await addFarmActivity(activityData);
      toast.success('Activity logged successfully!');

      // reset form
      setFormData({
        farmerId: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        cost: '',
        seedVariety: '',
        seedSource: '',
        seedQuantity: '',
        seedLotNumber: '',
        fertilizerType: '',
        fertilizerAmount: '',
        pesticideType: '',
        pesticideAmount: '',
        pestControlMethod: '',
        pestTarget: '',
        generalDetails: '',
      });

      navigate(`/farmer/${newActivity.farmer}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to log activity.');
    } finally {
      setLoading(false);
    }
  };

  const renderConditionalFields = () => {
    const inputClass =
      'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition focus:scale-[1.02] p-1';

    switch (formData.type) {
      case 'Planting':
        return (
          <>
            <label htmlFor="seedVariety">Seed Variety</label>
            <input type="text" id="seedVariety" name="seedVariety" value={formData.seedVariety} onChange={onChange} className={inputClass} placeholder="e.g., Pioneer P3812W" required />
            <label htmlFor="seedSource">Seed Source</label>
            <input type="text" id="seedSource" name="seedSource" value={formData.seedSource} onChange={onChange} className={inputClass} placeholder="e.g., AgroVet Supplies Ltd." required />
            <label htmlFor="seedQuantity">Seed Quantity</label>
            <input type="text" id="seedQuantity" name="seedQuantity" value={formData.seedQuantity} onChange={onChange} className={inputClass} placeholder="e.g., 25 kg" required />
            <label htmlFor="seedLotNumber">Seed Lot Number</label>
            <input type="text" id="seedLotNumber" name="seedLotNumber" value={formData.seedLotNumber} onChange={onChange} className={inputClass} placeholder="e.g., LOT#MZ-2025-001" />
          </>
        );

      case 'Fertilizer Application':
        return (
          <>
            <label htmlFor="fertilizerType">Fertilizer Type</label>
            <input type="text" id="fertilizerType" name="fertilizerType" value={formData.fertilizerType} onChange={onChange} className={inputClass} placeholder="e.g., NPK 17-17-17" required />
            <label htmlFor="fertilizerAmount">Amount</label>
            <input type="text" id="fertilizerAmount" name="fertilizerAmount" value={formData.fertilizerAmount} onChange={onChange} className={inputClass} placeholder="e.g., 2 bags (100 kg)" required />
          </>
        );

      case 'Pesticide Application':
        return (
          <>
            <label htmlFor="pesticideType">Pesticide Type</label>
            <input type="text" id="pesticideType" name="pesticideType" value={formData.pesticideType} onChange={onChange} className={inputClass} placeholder="e.g., Thunder 100ml" required />
            <label htmlFor="pesticideAmount">Amount</label>
            <input type="text" id="pesticideAmount" name="pesticideAmount" value={formData.pesticideAmount} onChange={onChange} className={inputClass} placeholder="e.g., 2 liters" required />
          </>
        );

      case 'Pest Control':
        return (
          <>
            <label htmlFor="pestControlMethod">Method</label>
            <input type="text" id="pestControlMethod" name="pestControlMethod" value={formData.pestControlMethod} onChange={onChange} className={inputClass} placeholder="e.g., Biological release, traps" required />
            <label htmlFor="pestTarget">Target Pest</label>
            <input type="text" id="pestTarget" name="pestTarget" value={formData.pestTarget} onChange={onChange} className={inputClass} placeholder="e.g., Aphids, armyworm" />
          </>
        );

      case 'Weeding':
      case 'Irrigation':
      case 'Field Maintenance/General Maintenance':
        return (
          <>
            <label htmlFor="generalDetails">Details</label>
            <textarea id="generalDetails" name="generalDetails" value={formData.generalDetails} onChange={onChange} className={inputClass} rows={3} placeholder={`Enter details for ${formData.type.toLowerCase()}`} required />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 sm:px-0">
      <section className="rounded-lg bg-white p-4 sm:p-8 shadow" aria-labelledby="activity-form-heading">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900" id="activity-form-heading">Record Farm Operations</h1>
        </header>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <label htmlFor="farmerId">Select Farmer</label>
          <select id="farmerId" name="farmerId" value={formData.farmerId} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1" required>
            <option value="" disabled>-- Select a farmer --</option>
            {farmers.map(f => <option key={f._id} value={f._id}>{f.name} - {f.region}</option>)}
          </select>

          <label htmlFor="activityType">Operation Type</label>
          <select id="activityType" name="type" value={formData.type} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1" required>
            <option value="" disabled>-- Select farm operation --</option>
            {activityTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          {formData.type && (
            <>
              <label htmlFor="activityDate">Activity Date</label>
              <input type="date" id="activityDate" name="date" value={formData.date} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1" required />
              {renderConditionalFields()}
              <label htmlFor="activityCost">Cost (KES, optional)</label>
              <input type="number" id="activityCost" name="cost" value={formData.cost} onChange={onChange} placeholder="1500" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-1" />
            </>
          )}

          <button type="submit" disabled={loading} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </section>
    </main>
  );
}
