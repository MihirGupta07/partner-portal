import React, { useState, useEffect } from 'react';
import { assessments } from '../data/dummyAssessments';

const ScoreChartModal = ({ assessmentId, onClose }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load assessment data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundAssessment = assessments.find(a => a.id === assessmentId);
      setAssessment(foundAssessment);
      setLoading(false);
    }, 300);
  }, [assessmentId]);

  // Function to render score bars
  const renderScoreBars = () => {
    if (!assessment || !assessment.values) return null;
    
    return Object.entries(assessment.values).map(([key, value]) => (
      <div key={key} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </span>
          <span className="text-sm font-medium text-gray-700">{value}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {loading ? 'Loading Assessment Data...' : `${assessment?.assessmentName} Results`}
                </h3>
                
                {loading ? (
                  <div className="mt-4 text-center">Loading assessment data...</div>
                ) : (
                  <div className="mt-4">
                    {assessment?.values ? (
                      <div>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Overall Score</span>
                            <span className="text-sm font-medium text-gray-700">{assessment.score}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-600 h-2.5 rounded-full" 
                              style={{ width: `${assessment.score}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <h4 className="text-md font-medium text-gray-800 mt-6 mb-3">Detailed Scores</h4>
                        {renderScoreBars()}
                      </div>
                    ) : (
                      <p className="text-gray-500">No score data available for this assessment.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreChartModal; 