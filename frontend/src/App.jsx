import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FarmerList from './pages/FarmerList.jsx';
import FarmerProfile from './pages/FarmerProfile.jsx';
import RegisterFarmer from './pages/RegisterFarmer.jsx';
import RecordCollection from './pages/RecordCollection.jsx';
import AddActivity from './pages/AddActivity.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Roles from './pages/Roles';

function App() {
  return (
    <>
      <Navbar />
      
      <div className="min-h-[calc(100vh-128px)] p-4 sm:p-6 lg:p-8">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/roles" element={<Roles />} />

          {/* Protected Routes (All Roles) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/farmer/:id" element={<FarmerProfile />} />
          </Route>
          
          {/* Field Officer Routes */}
          <Route element={<ProtectedRoute roles={['Admin', 'FieldOfficer']} />}>
            <Route path="/farmers" element={<FarmerList />} />
            <Route path="/register-farmer" element={<RegisterFarmer />} />
            <Route path="/record-collection" element={<RecordCollection />} />
            <Route path="/add-activity" element={<AddActivity />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<Dashboard />} /> 
          </Route>
          
        </Routes>
      </div>
      <ToastContainer autoClose={3000} />
      <Footer />
    </>
  );
}

export default App;