import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 transition-all transform hover:shadow-lg hover:scale-[1.01]">
      <div className="flex items-center">
        <div className="shrink-0">
            {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
          <dd className="text-xl font-semibold tracking-tight text-gray-900">
            {value}
          </dd>
        </div>
      </div>
    </div>
  );
};

export default StatCard;