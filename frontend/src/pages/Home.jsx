import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CheckCircleIcon, UserGroupIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      name: 'End-to-End Traceability',
      description: 'Gain full visibility from farm to factory. Our platform logs every interaction, from seeding and fertilizer use to final produce collection.',
      icon: CheckCircleIcon,
    },
    {
      name: 'Farmer Management',
      description: 'Manage all your contracted farmers, their regions, and assigned crops in one central, digital database. Ditch the scattered spreadsheets and paper files.',
      icon: UserGroupIcon,
    },
    {
      name: 'AI-Powered Insights',
      description: 'Turn your field data into profit. Our AI predicts harvest volumes, flags supply chain risks, and provides automated insights on quality and farmer performance.',
      icon: SparklesIcon,
    },
  ];

  const renderLoginButtons = () => {
    if (user) {
      // User is logged in
      const destination = user.role === 'Admin' ? '/dashboard' : '/farmers';
      return (
        <Link
          to={destination}
          className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Go to App <ArrowRightIcon className="inline h-5 w-5" />
        </Link>
      );
    }

    // User is logged out. Show the two role-based buttons.
    return (
      <>
        <Link
          to="/login"
          className="rounded-md bg-green-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Manager Login
        </Link>
        <Link
          to="/login"
          className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Field Officer Login
        </Link>
      </>
    );
  };


  return (
    <div className="bg-gray">
      <main>
        {/* HERO SECTION */}
        <div className="relative isolate flex items-center overflow-hidden h-screen">
          
          {/* BACKGROUND IMAGE & OVERLAY */}
          <div 
            className="absolute inset-0 -z-10 bg-[url('/farm-image.png')] bg-cover bg-center" 
            aria-hidden="true" 
          />
          <div 
            className="absolute inset-0 -z-10 bg-black/50" 
            aria-hidden="true" 
          />

          <div className="w-full px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                AgriTrace AI
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-gray-200">
                Digitizing the first mile of your supply chain. We turn the black box of farm-to-processor data into a clear pipeline, providing end-to-end visibility and AI insights to ensure quality, compliance, and trust.
              </p>
              
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {renderLoginButtons()}
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE SECTION */}
        <div className="mt-16 py-16 sm:mt-20 sm:py-2">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold leading-7 text-green-600">Everything in one place</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Turn agricultural data into business intelligence
              </p>
            </div>
            <div className="mt-16 sm:mt-20 lg:mt-24">
              <dl className="mx-auto grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                {features.map((feature) => (
                  <div key={feature.name} className="flex flex-col">
                    <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                      <feature.icon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                      {feature.name}
                    </dt>
                    <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}