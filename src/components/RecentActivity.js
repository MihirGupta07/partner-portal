import React from 'react';

const RecentActivity = ({ recentActivity, loading, title = "Recent Activity" }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="px-4 py-4 text-center">Loading recent assessments...</div>
        ) : recentActivity.length === 0 ? (
          <div className="px-4 py-4 text-center text-gray-500">No completed assessments found</div>
        ) : (
          recentActivity.map((activity, index) => (
            <div key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-green-100">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.userName} - {activity.assessmentType}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-green-100 text-green-800">
                      Completed
                    </span>
                    <span className="ml-2">
                      {new Date(activity.updatedOn).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          View all completed assessments &rarr;
        </button>
      </div>
    </div>
  );
};

export default RecentActivity; 