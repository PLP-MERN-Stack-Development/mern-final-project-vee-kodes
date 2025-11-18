import React from 'react';
import { BuildingOfficeIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  return (
    <div className="relative isolate bg-gray py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get in touch</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have questions about our platform or want to schedule a demo? We'd love to hear from you.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          
          <div className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
              <BuildingOfficeIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
              Our Office
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p className="flex-auto">
                123 AgriTrace Towers<br />
                Westlands, Nairobi, Kenya
              </p>
            </dd>
          </div>
          
          <div className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
              <PhoneIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
              Call Us
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p className="flex-auto">
                +254 700 123 456
              </p>
            </dd>
          </div>

          <div className="flex flex-col">
            <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
              <EnvelopeIcon className="h-5 w-5 flex-none text-green-600" aria-hidden="true" />
              Email
            </dt>
            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
              <p className="flex-auto">
                <a href="mailto:sales@agritrace.ai" className="text-green-600 hover:text-green-500">
                  sales@agritrace.ai
                </a> (Sales)<br />
                <a href="mailto:support@agritrace.ai" className="text-green-600 hover:text-green-500">
                  support@agritrace.ai
                </a> (Support)
              </p>
            </dd>
          </div>
          
        </div>
      </div>
    </div>
  );
}
