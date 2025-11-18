import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email, password } = formData;

  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If user is already logged in, redirect them
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/dashboard');
      } else if (user.role === 'FieldOfficer') {
        navigate('/farmers');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success(`Welcome, ${userData.name}!`);

      if (userData.role === 'Admin') {
        navigate('/dashboard', { replace: true });
      } else if (userData.role === 'FieldOfficer') {
        navigate('/farmers', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      setLoading(false);

    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <header className="sm:mx-auto sm:w-full sm:max-w-sm">
        <CheckCircleIcon className="mx-auto h-12 w-auto text-green-600" aria-hidden="true" />
        <h1 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your Account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your official email and password.
        </p>
      </header>

      <section className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm" aria-labelledby="login-form-heading">
        <h2 id="login-form-heading" className="sr-only">Login Form</h2>
        <form className="space-y-6" onSubmit={onSubmit} noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={onChange}
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 p-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 transition focus:scale-[1.02]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
        
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={onChange}
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 p-2.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6 transition focus:scale-[1.02]"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-green-600 rounded-full"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50 transition-transform active:scale-95"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}