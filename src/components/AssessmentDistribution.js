import React from 'react';

const AssessmentDistribution = ({ filteredAssessments, loading }) => {
  // Generate assessment type distribution data
  const assessmentTypeDistribution = () => {
    const distribution = {};
    console.log('filteredAssessments', filteredAssessments);
    
    filteredAssessments?.forEach(assessment => {
      if (distribution[assessment.assessmentName]) {
        distribution[assessment.assessmentName]++;
      } else {
        distribution[assessment.assessmentName] = 1;
      }
    });
    
    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / filteredAssessments.length) * 100)
    }));
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assessment Distribution</h3>
          <div className="flex space-x-2">
            {/* Optional buttons for future enhancement */}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading distribution data...</p>
          </div>
        ) : (
          <div className="h-64">
            {filteredAssessments.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No assessment data available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessmentTypeDistribution().map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">{item.name}</span>
                      <span className="text-sm font-medium text-gray-600">{item.count} ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`rounded-full h-2 ${
                          index % 3 === 0 ? 'bg-indigo-500' : 
                          index % 3 === 1 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDistribution; 