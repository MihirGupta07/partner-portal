import React from 'react';
import { FiX } from 'react-icons/fi';

const DateFilterPanel = ({ 
  startDate, 
  endDate, 
  setStartDate, 
  setEndDate, 
  showDateFilter, 
  setShowDateFilter 
}) => {
  const handleDateFilterSubmit = (e) => {
    e.preventDefault();
    setShowDateFilter(false);
    // The effect will trigger and filter assessments
  };

  return (
    <>
      {showDateFilter && (
        <div className="bg-white shadow-lg rounded-lg p-5 mb-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filter by Date Range</h3>
          <form onSubmit={handleDateFilterSubmit} className="flex flex-wrap items-end gap-5">
            <div className="w-full sm:w-auto">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="date"
                  name="start-date"
                  id="start-date"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:w-52 text-sm border-gray-300 rounded-md py-2"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="date"
                  name="end-date"
                  id="end-date"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:w-52 text-sm border-gray-300 rounded-md py-2"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-2 sm:mt-0">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
              >
                <FiX className="mr-2 h-4 w-4 text-gray-500" />
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default DateFilterPanel; 