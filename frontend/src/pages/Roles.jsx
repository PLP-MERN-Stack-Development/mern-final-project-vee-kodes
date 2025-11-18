import React from 'react';
import { BuildingOfficeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Roles() {
  return (
    <div className="bg-gray py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-green-600">Built for Your Team</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Clear roles for clear results
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AgriTrace AI is built on two key user roles to ensure security, accountability, and ease of use.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col rounded-lg bg-gray-50 p-8 ring-1 ring-gray-900/5">
            <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
              <BuildingOfficeIcon className="h-8 w-8 flex-none text-green-600" aria-hidden="true" />
              For the Manager (Admin)
            </dt>
            <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-gray-600">
              <p className="flex-auto">
                The manager's role is about oversight and strategy. Log in to the web dashboard to get a complete 360-degree view of your entire operation.
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-base">
                <li>View all dashboard charts and financial stats.</li>
                <li>Analyze AI-driven insights and forecasts.</li>
                <li>Manage payments and track quality grades.</li>
                <li>Search all farmers and view their complete histories.</li>
                <li>Register new Field Officers and manage users.</li>
              </ul>
            </dd>
          </div>
          <div className="flex flex-col rounded-lg bg-gray-50 p-8 ring-1 ring-gray-900/5">
            <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
              <UserIcon className="h-8 w-8 flex-none text-green-600" aria-hidden="true" />
              For the Field Officer
            </dt>
            <dd className="mt-6 flex flex-auto flex-col text-lg leading-7 text-gray-600">
              <p className="flex-auto">
                The field officer's role is simple: data capture. The mobile-friendly app is their tool for logging all on-the-ground activities as they happen.
              </p>
              <ul className="mt-6 list-disc space-y-2 pl-5 text-base">
                <li>Register new farmers.</li>
                <li>Log farm activities (Seeding, Weeding, etc.).</li>
                <li>Record produce collections at the farm gate.</li>
                <li>View profiles and histories for their assigned farmers.</li>
              </ul>
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}