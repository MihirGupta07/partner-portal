import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import AssessmentsTable from './AssessmentsTable';

const RecentAssessments = ({ filteredAssessments, loading, handleDeleteAssessment }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden lg:col-span-2">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Assessments</h3>
          <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-900" onClick={() => navigate(ROUTES.ASSESSMENTS)}>
            View All
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="px-4 py-5 sm:p-6 text-center">Loading assessments...</div>
      ) : (
        <div className="overflow-x-auto">
          {filteredAssessments?.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No assessments found for the selected criteria.
            </div>
          ) : (
            <AssessmentsTable 
              assessments={filteredAssessments?.slice(0, 5)} 
              onDelete={handleDeleteAssessment}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RecentAssessments; 