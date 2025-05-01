import React, { useState, useEffect } from 'react';
import { assessments } from '../data/dummyAssessments';
import { useAuth } from '../utils/AuthContext';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AssessmentsTable from '../components/AssessmentsTable';

const AssessmentsPage = () => {
  const { currentPartner } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlUserId = queryParams.get('userId');
  
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [filters, setFilters] = useState({
    userId: urlUserId || '',
    assessmentType: '',
    status: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(true);

  // Get assessment types from partner
  const assessmentTypes = currentPartner.assessments.map(a => ({
    id: a.id,
    name: a.name
  }));

  // Filter assessments based on all filters
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // const partnerAssessmentIds = currentPartner.assessments.map(a => a.id);
      
      const filtered = assessments.filter(assessment => {
        // Basic filter - must be for this partner
        const matchesPartner = assessment.partnerId === currentPartner.id;
        
        // Filter by user ID if specified
        const matchesUser = !filters.userId || assessment.userId === filters.userId;
        
        // Filter by assessment type if specified
        const matchesType = !filters.assessmentType || assessment.assessmentId === filters.assessmentType;
        
        // Filter by status if specified
        const matchesStatus = !filters.status || assessment.status === filters.status;
        
        // Filter by date range if specified
        let matchesDateRange = true;
        if (filters.startDate && filters.endDate) {
          const assessmentDate = new Date(assessment.created);
          const filterStartDate = new Date(filters.startDate);
          const filterEndDate = new Date(filters.endDate);
          // Set end date to end of day
          filterEndDate.setHours(23, 59, 59);
          
          matchesDateRange = assessmentDate >= filterStartDate && assessmentDate <= filterEndDate;
        }
        
        return matchesPartner && matchesUser && matchesType && matchesStatus && matchesDateRange;
      });
      
      setFilteredAssessments(filtered);
      setLoading(false);
    }, 500);
  }, [currentPartner.id, filters, currentPartner.assessments]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      userId: '',
      assessmentType: '',
      status: '',
      startDate: '',
      endDate: ''
    });
  };

  // Handle assessment deletion (for "Assigned" status only)
  const handleDeleteAssessment = (id) => {
    // In a real app, this would call an API to delete the assessment
    // For demo purposes, we filter it from our local state
    setFilteredAssessments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Assessments</h1>
          
          {/* Filters */}
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Filters</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Use these filters to find specific assessments
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                        User ID
                      </label>
                      <input
                        type="text"
                        name="userId"
                        id="userId"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={filters.userId}
                        onChange={handleFilterChange}
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="assessmentType" className="block text-sm font-medium text-gray-700">
                        Assessment Type
                      </label>
                      <select
                        id="assessmentType"
                        name="assessmentType"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={filters.assessmentType}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Types</option>
                        {assessmentTypes.map(type => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={filters.status}
                        onChange={handleFilterChange}
                      >
                        <option value="">All Statuses</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In-Process">In-Process</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      {/* Empty for grid alignment */}
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                    
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Assessments Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Assessment Results
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {filteredAssessments.length} assessments found
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
                    assessments={filteredAssessments} 
                    showFilters={true}
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

export default AssessmentsPage; 