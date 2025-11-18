import React from 'react';
import { BuildingOffice2Icon, GlobeAltIcon, SparklesIcon, ChartPieIcon, ShieldCheckIcon, BeakerIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    // Main container
    <div className="relative isolate overflow-hidden bg-[url('/vineyard-about.png')] bg-cover bg-center pb-24 sm:pb-32">
      <div className="absolute inset-0 -z-10 bg-white/80" aria-hidden="true" />
      {/* Content wrapper */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl text-center lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">About AgriTrace AI</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AgriTrace AI was founded to solve one of the biggest challenges in the agricultural supply chain: a lack of trust, traceability, and efficiency.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <div className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
              <BuildingOffice2Icon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
              Our Mission
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
              <p className="flex-auto">
                Our mission is to digitize the farm-to-processor pipeline, using technology to build trust, ensure quality, and create a sustainable food future. We empower agribusinesses and processors with the data they need to make smarter decisions.
              </p>
            </dd>
          </div>

          <div className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
              <GlobeAltIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
              Our Vision
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
              <p className="flex-auto">
                We envision a world where every consumer can trust the food they eat. By providing flawless end-to-end traceability, we aim to be the gold standard for agricultural supply chain management, starting here in Kenya and expanding globally.
              </p>
            </dd>
          </div>
        
          <div className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
              <SparklesIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
              Our Technology
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
              <p className="flex-auto">
                Built on a modern, secure, and scalable stack, our platform uses AI to turn raw field data into actionable insights. We're not just tracking data; we're predicting the future of your harvest.
              </p>
            </dd>
          </div>
        </div>

        {/* SDG alignment */}
        <div className="mx-auto mt-24 max-w-2xl text-center lg:max-w-none">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Sustainable Impact
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Our commitment goes beyond just business. We are proud to align our platform with the UN Sustainable Development Goals (SDGs) to drive meaningful change.
          </p>
          <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
                <ChartPieIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                SDG 2: Zero Hunger
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                <p className="flex-auto">
                  By using AI to forecast yields and reduce post-harvest losses, we improve the efficiency and resilience of the food supply chain, making more food available.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
                <BeakerIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                SDG 9: Industry & Innovation
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                <p className="flex-auto">
                  We are building the digital infrastructure for a new generation of agriculture. Our platform is a clear innovation that strengthens the processing industry.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-2xl font-semibold leading-7 text-gray-900">
                <ShieldCheckIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
                SDG 12: Responsible Production
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-lg leading-7 text-gray-600">
                <p className="flex-auto">
                  Our core traceability feature is the definition of this goal. We empower processors and consumers to verify sustainable sourcing and production practices.
                </p>
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </div>
  );
}