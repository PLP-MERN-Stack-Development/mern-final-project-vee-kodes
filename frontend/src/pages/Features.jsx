import React from 'react';
import { 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon, 
  BeakerIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function Features() {
  const features = [
    {
      name: 'Farmer Management',
      description: 'A central, digital hub for all your contracted farmers. Track their profiles, regions, and crop contracts in one place.',
      icon: UserGroupIcon,
      details: [
        'Register new farmers in seconds.',
        'View detailed profiles with all associated activities and collections.',
        'Filter and search your entire farmer database.'
      ]
    },
    {
      name: 'Real-Time Field Tracking',
      description: 'Digitize every "first mile" interaction. Your field officers log data live, giving you immediate insights.',
      icon: ClipboardDocumentListIcon,
      details: [
        'Log all farm activities with guided, conditional inputs (e.g., "Seeding", "Fertilizer").',
        'Record every collection with weight, quality grade, and payment details.',
        'Capture optional costs for a full financial picture.'
      ]
    },
    {
      name: 'The Manager Dashboard',
      description: 'This is your command center. We turn raw field data into actionable business intelligence.',
      icon: ChartBarIcon,
      details: [
        'Monitor 5 key financial and operational stats, including "Outstanding Payments" and "Avg. Cost per Kg".',
        'Analyze 4 critical charts: Supply Trends, Quality Grades, Yield by Region, and Yield by Crop.',
        'Gain immediate oversight of your entire supply chain at a glance.'
      ]
    },
    {
      name: 'AI & Predictive Forecasting',
      description: 'Stop reacting and start planning. Our AI analyzes your data to predict future supply.',
      icon: BeakerIcon,
      details: [
        'Get insights on risks and opportunities in your supply chain.',
        'Receive AI-driven yield forecasts based on Seeding activities.',
        'Use these predictions to plan factory schedules, logistics, and sales.'
      ]
    },
    {
      name: 'Financial & Quality Control',
      description: 'Manage your two biggest risks: cost and quality.',
      icon: CurrencyDollarIcon,
      details: [
        'Track Pending vs. Paid status for every collection.',
        'Analyze your Quality Grade Distribution" to see what percentage of your supply is A, B, C, or Reject.',
        'Ensure you are paying the right price for the right quality.'
      ]
    },
    {
      name: 'Compliance & Traceability',
      description: 'Prove the origin and quality of your product with the click of a button.',
      icon: ShieldCheckIcon,
      details: [
        'Trace any batch of produce back to the specific farmer, region, and inputs used.',
        'Use AI insights to help generate compliance reports for your clients or export.',
        'Build trust with your customers through verifiable data.'
      ]
    },
  ];

  return (
    <div className="bg-gray py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:max-w-none">
          <h2 className="text-base font-semibold leading-7 text-green-600">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your supply chain
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AgriTrace AI is more than just a tracking app. It's a complete management, analytics, and forecasting platform designed for agribusiness processors.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col rounded-lg bg-gray-50 p-6 ring-1 ring-gray-900/5">
                <dt className="flex items-center gap-x-3 text-xl font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-base">
                    {feature.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}