import React, { useState, useEffect } from 'react';
import { assessments } from '../data/dummyAssessments';
import { getColorByScore } from '../utils/scoreUtils';

const ScoreChartModal = ({ assessment: selectedAssessment, onClose }) => {
  const [assessment, setAssessment] = useState(selectedAssessment?.assessment);
  const dateOfBirth = selectedAssessment?.dateOfBirth;
  const [loading, setLoading] = useState(false);
  // Load assessment data
  // useEffect(() => {
  //   // Simulate API call
  //   setTimeout(() => {
  //     const foundAssessment = assessments.find(a => a.id === assessmentId);
  //     setAssessment(foundAssessment);
  //     setLoading(false);
  //   }, 300);
  // }, [assessmentId]);

  // Function to render category scores
  const renderCategoryScores = () => {
    if (!assessment || !assessment.categories) return null;
    
    return assessment.categories.map((category) => (
      <div key={category.key} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {category.key.replace(/_/g, ' ')}
          </span>
          <span className="text-sm font-medium text-gray-700">{category.value}/800</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full" 
            style={{ 
              width: `${(category.value / 800) * 100}%`,
              backgroundColor: getColorByScore(category.value)
            }}
          ></div>
        </div>
      </div>
    ));
  };

  // Function to render skill scores
  const renderSkillScores = () => {
    if (!assessment || !assessment.skills) return null;
    
    return assessment.skills.map((skill) => (
      <div key={skill.key} className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">
            {skill.key.replace(/_/g, ' ')}
          </span>
          <span className="text-sm font-medium text-gray-700">{skill.value}/800</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="h-2.5 rounded-full" 
            style={{ 
              width: `${(skill.value / 800) * 100}%`,
              backgroundColor: getColorByScore(skill.value)
            }}
          ></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-51 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex z-51 items-end justify-center min-h-[calc(100vh-5rem)] pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed top-16 inset-x-0 bottom-0 z-51 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full max-h-[85vh]">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {loading ? 'Loading Assessment Data...' : `Assessment Results`}
                </h3>
                
                {loading ? (
                  <div className="mt-4 text-center">Loading assessment data...</div>
                ) : (
                  <div className="mt-4 h-[60vh] overflow-y-auto pr-2">
                    {assessment ? (
                      <div>
                        <div className="mb-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Overall Score</span>
                            <span className="text-sm font-medium text-gray-700">{assessment.score}/800</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full" 
                              style={{ 
                                width: `${(assessment.score / 800) * 100}%`,
                                backgroundColor: getColorByScore(assessment.score)
                              }}
                            ></div>
                          </div>
                        </div>
                        
                        {assessment.cognitiveAge && (
                          <div className="mb-6 p-4 bg-blue-50 rounded-md border-l-4 border-blue-300">
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Real Age: <span className="font-bold">{dateOfBirth ? (() => {
                                const dob = new Date(dateOfBirth);
                                const today = new Date();
                                let age = today.getFullYear() - dob.getFullYear();
                                const m = today.getMonth() - dob.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                                  age--;
                                }
                                return age;
                              })() : 'N/A'} years</span>
                             
                            </p>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Cognitive Age: <span className="font-bold">{assessment.cognitiveAge.age} years</span>
                            </p>
                            <p className="text-sm font-medium text-gray-700">
                            Precision: <span className="font-bold">{assessment.cognitiveAge.precision}</span>
                              
                            </p>
                            
                            
                          </div>
                        )}
                        
                        {assessment.categories && assessment.categories.length > 0 && (
                          <div className="border rounded-lg p-4 mb-6 bg-white">
                            <h4 className="text-lg font-semibold text-gray-800  mb-4 pb-2 border-b border-gray-200">Categories</h4>
                            {renderCategoryScores()}
                          </div>
                        )}
                        
                        {assessment.skills && assessment.skills.length > 0 && (
                          <div className="border rounded-lg p-4 mb-6 bg-white">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Skills</h4>
                            {renderSkillScores()}
                          </div>
                        )}
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