import React, { useState, useEffect } from 'react';
import { assessments } from '../data/dummyAssessments';
import { useAuth } from '../utils/AuthContext';
import NavBar from '../components/NavBar';
import AssessmentsTable from '../components/AssessmentsTable';

const DashboardPage = () => {
  const { currentPartner } = useAuth();
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalInProcess: 0,
    totalCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  // Filter assessments to only those for this partner
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Filter for only assessments that match partner's assessment IDs
      const partnerAssessmentIds = currentPartner.assessments.map(a => a.id);
      
      const filtered = assessments.filter(
        assessment => {
          const matchesPartner = assessment.partnerId === currentPartner.id;
          const matchesAssessmentType = partnerAssessmentIds.includes(assessment.assessmentId);
          
          let matchesDateRange = true;
          if (startDate && endDate) {
            const assessmentDate = new Date(assessment.created);
            const filterStartDate = new Date(startDate);
            const filterEndDate = new Date(endDate);
            // Set end date to end of day
            filterEndDate.setHours(23, 59, 59);
            
            matchesDateRange = assessmentDate >= filterStartDate && assessmentDate <= filterEndDate;
          }
          
          return matchesPartner && matchesAssessmentType && matchesDateRange;
        }
      );
      
      // Calculate stats
      const assigned = filtered.filter(a => a.status === 'Assigned').length;
      const inProcess = filtered.filter(a => a.status === 'In-Process').length;
      const completed = filtered.filter(a => a.status === 'Completed').length;
      
      setStats({
        totalAssigned: assigned,
        totalInProcess: inProcess,
        totalCompleted: completed
      });
      
      setFilteredAssessments(filtered);
      setLoading(false);
    }, 500);
  }, [currentPartner, startDate, endDate]);

  // Handle date filter changes
  const handleDateFilterSubmit = (e) => {
    e.preventDefault();
    // The effect will trigger and filter assessments
  };

  // Handle assessment deletion (for "Assigned" status only)
  const handleDeleteAssessment = (id) => {
    // In a real app, this would call an API to delete the assessment
    // For demo purposes, we filter it from our local state
    const updatedAssessments = filteredAssessments.filter(a => a.id !== id);
    
    // Update counts
    const assigned = updatedAssessments.filter(a => a.status === 'Assigned').length;
    
    setStats({
      ...stats,
      totalAssigned: assigned
    });
    
    setFilteredAssessments(updatedAssessments);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Assigned Assessments
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? '...' : stats.totalAssigned}
                  </dd>
                </dl>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In-Process Assessments
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? '...' : stats.totalInProcess}
                  </dd>
                </dl>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Assessments
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? '...' : stats.totalCompleted}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          
          {/* Date filters */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Date Range Filter</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Filter assessments by creation date
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleDateFilterSubmit}>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="start-date"
                        id="start-date"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="end-date"
                        id="end-date"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        setStartDate('');
                        setEndDate('');
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Apply Filter
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Recent assessments */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Recent Assessments
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {currentPartner.customMessage || 'The most recent assessments for your organization.'}
              </p>
            </div>
            
            {loading ? (
              <div className="px-4 py-5 sm:p-6 text-center">Loading assessments...</div>
            ) : (
              <div className="px-4 py-5 sm:p-6">
                {filteredAssessments.length === 0 ? (
                  <p className="text-gray-500">No assessments found for the selected criteria.</p>
                ) : (
                  <AssessmentsTable 
                    assessments={filteredAssessments.slice(0, 10)} 
                    onDelete={handleDeleteAssessment}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 