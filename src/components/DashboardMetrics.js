import React from 'react';

const DashboardMetrics = ({ stats, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Assigned Assessments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {loading ? '...' : stats.totalAssigned}
              </dd>
            </div>
            <div className="p-3 bg-indigo-50 rounded-full">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                In-Process Assessments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {loading ? '...' : stats.totalInProcess}
              </dd>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Completed Assessments
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {loading ? '...' : stats.totalCompleted}
              </dd>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <dt className="text-sm font-medium text-gray-500 truncate">
                Completion Rate
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {loading ? '...' : `${stats.completionRate}%`}
              </dd>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics; 