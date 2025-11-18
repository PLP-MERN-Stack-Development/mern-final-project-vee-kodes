import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerFarmer } from '../services/farmerService';


const farmerRegions = [
  'Central',
  'Coast',
  'Eastern',
  'Nairobi',
  'North Eastern',
  'Nyanza',
  'Rift Valley',
  'Western',
];

export default function RegisterFarmer() {
  const [formData, setFormData] = useState({
    name: '',
    region: '', 
    contact: '',
    contractedCrop: '',
    contractId: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, region, contact, contractedCrop, contractId } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!region) {
      toast.error('Please select a region.');
      return;
    }

    setLoading(true);
    try {
      const newFarmer = await registerFarmer(formData);
      toast.success(`Farmer ${newFarmer.name} registered!`);
      navigate(`/farmer/${newFarmer._id}`);
    } catch (error) {
      setLoading(false);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        'Failed to register farmer. Please try again.';
      toast.error(message);
    }
  };

  return (
    <main className="mx-auto max-w-lg px-4 sm:px-0">
      <section className="rounded-lg bg-white p-4 sm:p-8 shadow" aria-labelledby="register-form-heading">
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900" id="register-form-heading">
            Register New Farmer
          </h1>
        </header>
        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" value={name} onChange={onChange} required 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition focus:scale-[1.02] p-1"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
            <select
              name="region"
              id="region"
              value={region}
              onChange={onChange}
              required 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition focus:scale-[1.02] p-1"
            >
              <option value="">Please select a region</option>
              {farmerRegions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact (Phone)</label>
            <input type="text" name="contact" id="contact" value={contact} onChange={onChange} required 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition focus:scale-[1.02] p-1"
            />
          </div>
          <div>
            <label htmlFor="contractedCrop" className="block text-sm font-medium text-gray-700">Contracted Crop</label>
            <input type="text" name="contractedCrop" id="contractedCrop" value={contractedCrop} onChange={onChange} required 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition focus:scale-[1.02] p-1"
            />
          </div>
          <div>
            <label htmlFor="contractId" className="block text-sm font-medium text-gray-700">Contract ID</label>
            <input type="text" name="contractId" id="contractId" value={contractId} onChange={onChange} 
                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 transition focus:scale-[1.02] p-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 disabled:opacity-50 transition-transform active:scale-95"
          >
            {loading ? 'Registering...' : 'Register Farmer'}
          </button>
        </form>
      </section>
    </main>
  );
}