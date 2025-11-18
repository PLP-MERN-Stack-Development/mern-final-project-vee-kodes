import React from 'react';
import { ShieldCheckIcon, PencilSquareIcon, TruckIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    name: 'Step 1: Register Farmers',
    description: 'Your Field Officer registers a new farmer and their contracted crop. This creates a digital profile for all future interactions.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Step 2: Log Field Activities',
    description: 'The officer uses the app to log all farm activities, from Seeding and Fertilizer use to Pest Control, creating a full traceability record.',
    icon: PencilSquareIcon,
  },
  {
    name: 'Step 3: Record Collections',
    description: 'During harvest, the officer records the collection, capturing the weight, quality grade (A, B, C, Reject), and payment details.',
    icon: TruckIcon,
  },
  {
    name: 'Step 4: Get Instant Insights',
    description: 'You, the Manager, instantly see this data on your dashboard. Your charts, stats, and AI forecasts are updated in real-time.',
    icon: ChartBarIcon,
  },
];

export default function HowItWorks() {
  return (
    <div className="bg-gray py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">How It Works</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            A simple 4-step process
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We digitize your pipeline from the field to your factory gate, turning on-the-ground actions into instant business insights.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-600 text-white">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <dt className="mt-4 text-lg font-semibold leading-7 text-gray-900">{step.name}</dt>
                <dd className="mt-2 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}