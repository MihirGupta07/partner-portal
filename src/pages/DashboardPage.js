import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useModal } from '../context/ModalContext';
import MonthlyTrends from '../components/MonthlyTrends';
// import AssessmentDistribution from '../components/AssessmentDistribution';
import RecentActivity from '../components/RecentActivity';
import RecentAssessments from '../components/RecentAssessments';
import WelcomeBanner from '../components/WelcomeBanner';
import withNavbar from '../components/withNavbar';
// import { useNavigate } from 'react-router-dom';
// import { ROUTES } from '../utils/constants';
import DashboardMetrics from '../components/DashboardMetrics';
import { partnerPortalService } from '../utils/apiService';

const DashboardPage = () => {
  const { currentPartner } = useAuth();
  const { openAssignModal, registerAssessmentCallback } = useModal();
  // const navigate = useNavigate();
  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    totalInProcess: 0,
    totalCompleted: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [trendType, setTrendType] = useState('month-on-month');
  const [recentCompletedAssessments, setRecentCompletedAssessments] = useState([]);
  const [error, setError] = useState('');

  // Function to fetch dashboard data
  const fetchDashboardData = () => {
    if (!currentPartner?._id) return;
    
    setLoading(true);
    setError('');
    
    Promise.all([
      partnerPortalService.getAssessmentStats(currentPartner._id),
      partnerPortalService.getAssessmentTrends(currentPartner._id, trendType),
      partnerPortalService.getAssignedProducts(currentPartner._id),
      partnerPortalService.getAssignedProducts(currentPartner._id, 'COMPLETED', '', '', 1, 4)
    ])
      .then(([statsData, trendsData, assessmentsData, completedAssessmentsData]) => {
        // Ensure consistent access to stats data
        const stats = statsData.data || statsData;
        
        setStats({
          totalAssigned: stats.total || 0,
          totalInProcess: stats.pending || 0,
          totalCompleted: stats.completed || 0,
          completionRate: stats.completionRate || (stats.total ? Math.round((stats.completed / stats.total) * 100) : 0)
        });
        
        setMonthlyStats(trendsData.data || []);
        
        const assessments = (assessmentsData.data?.assessments || assessmentsData.assessments || []);
        setFilteredAssessments(assessments);
        
        // Get recently completed assessments and sort by update date
        const completedAssessments = (completedAssessmentsData.data?.assessments || completedAssessmentsData.assessments || []);
        const sortedByDate = [...completedAssessments].sort((a, b) => new Date(b.updated) - new Date(a.updated));
        setRecentCompletedAssessments(sortedByDate.slice(0, 5));
        
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      });
  };

  // Register callback for assessment assignment
  useEffect(() => {
    const handleAssessmentAssigned = () => {
      if (currentPartner?._id) {
        fetchDashboardData();
      }
    };

    // Register the callback and get the cleanup function
    const unregister = registerAssessmentCallback(handleAssessmentAssigned);
    
    // Return the cleanup function to unregister when component unmounts
    return unregister;
  }, [currentPartner?._id, registerAssessmentCallback]);

  // Fetch dashboard stats and trends from API
  useEffect(() => {
    fetchDashboardData();
  }, [currentPartner, trendType]);

  // Handle assessment deletion (for "Assigned" status only)
  const handleDeleteAssessment = (id) => {
    const updatedAssessments = filteredAssessments.filter(a => a.id !== id);
    setFilteredAssessments(updatedAssessments);
    setStats(prev => ({
      ...prev,
      totalAssigned: updatedAssessments.filter(a => a.status === 'Assigned').length
    }));
  };

  // Handle trend type change
  const handleTrendTypeChange = (type) => {
    setTrendType(type);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex space-x-3">
            <button 
              onClick={openAssignModal}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Assign Assessment
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}
        {/* Custom Message or Welcome Banner */}
        <WelcomeBanner partner={currentPartner} />
        {/* Dashboard Metrics */}
        <DashboardMetrics stats={stats} loading={loading} />
        {/* Charts & Reports Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Assessment Trends */}
          <MonthlyTrends 
            monthlyStats={monthlyStats} 
            loading={loading} 
            trendType={trendType}
            onTrendTypeChange={handleTrendTypeChange}
          />
          {/* Recently Completed Assessments */}
          <RecentActivity 
            recentActivity={recentCompletedAssessments} 
            loading={loading} 
            title="Recently Completed Assessments"
          />
          {/* Recent Assessments Table */}
          <RecentAssessments 
            filteredAssessments={filteredAssessments} 
            loading={loading} 
            handleDeleteAssessment={handleDeleteAssessment}
          />
        </div>
      </main>
    </div>
  );
};

export default withNavbar(DashboardPage); 