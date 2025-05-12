import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../context/ModalContext";
import AssessmentsTable from "../components/AssessmentsTable";
import AssessmentNotesModal from "../components/AssessmentNotesModal";
import withNavbar from "../components/withNavbar";
import { partnerPortalService } from "../utils/apiService";
import { ROUTES } from "../utils/constants";

const AssessmentsPage = () => {
  const { currentPartner } = useAuth();
  const { openAssignModal } = useModal();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const urlUserId = queryParams.get("userId");

  const [filteredAssessments, setFilteredAssessments] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    assessmentType: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  // Add pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });
  // Add overall stats state to track totals regardless of filtering
  const [overallStats, setOverallStats] = useState({
    total: 0,
    assigned: 0,
    inProcess: 0,
    completed: 0,
  });

  // Add state for notes modal
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Get assessment types from partner
  const assessmentTypes =
    currentPartner?.assessments?.map((a) => ({
      id: a.id,
      name: a.name,
    })) || [];

  // Fetch assessments from API
  useEffect(() => {
    if (!currentPartner?._id) return;
    setLoading(true);
    setError("");
    partnerPortalService
      .getAssignedProducts(
        currentPartner?._id,
        filters.status,
        filters.startDate,
        filters.endDate,
        pagination.currentPage,
        pagination.limit,
        urlUserId
      )
      .then(({ data }) => {
        let assessments = data.assessments || [];
        // Filter by name and assessmentType if needed (API may not support these directly)
        if (filters.name) {
          assessments = assessments.filter((a) => a.userName && a.userName.toLowerCase().includes(filters.name.toLowerCase()));
        }
        if (filters.assessmentType) {
          assessments = assessments.filter(
            (a) => a.assessmentId === filters.assessmentType
          );
        }
        setFilteredAssessments(assessments);
        // Update pagination from API response
        if (data.pagination) {
          setPagination((prev) => ({
            currentPage: data.pagination.page,
            totalPages: data.pagination.pages,
            totalItems: data.pagination.total,
            limit: data.pagination.limit,
          }));
        }
        
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load assessments");
        setLoading(false);
      });
  }, [currentPartner?._id, filters, pagination.currentPage, pagination.limit, urlUserId]);
  
  // Fetch assessment stats from API
  useEffect(() => {
    if (!currentPartner?._id) return;
    
    partnerPortalService
      .getAssessmentPageStats(currentPartner?._id)
      .then((response) => {
        setOverallStats({
          total: response.data.total || 0,
          assigned: response.data.assigned || 0,
          inProcess: response.data.inProcess || 0,
          completed: response.data.completed || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to load assessment stats:", err);
      });
  }, [currentPartner?._id]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    // Reset to first page when filters change
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      name: "",
      assessmentType: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    // Reset to first page
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Check if any filter is applied
  const isAnyFilterApplied = () => {
    return (
      filters.name !== "" ||
      filters.assessmentType !== "" ||
      filters.status !== "" ||
      filters.startDate !== "" ||
      filters.endDate !== ""
    );
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  // Handle assessment deletion (for "Assigned" status only)
  const handleDeleteAssessment = (id) => {
    setFilteredAssessments((prev) => prev.filter((a) => a._id !== id));
    
    // Refresh stats after deletion
    if (currentPartner?._id) {
      partnerPortalService
        .getAssessmentPageStats(currentPartner._id)
        .then((response) => {
          setOverallStats({
            total: response.data.total || 0,
            assigned: response.data.assigned || 0,
            inProcess: response.data.inProcess || 0,
            completed: response.data.completed || 0,
          });
        })
        .catch((err) => {
          console.error("Failed to refresh assessment stats:", err);
        });
    }
  };

  // Use overall stats instead of calculating from filtered assessments
  const stats = overallStats;

  // Add function to handle opening the notes modal
  const handleManageNotes = (assessment) => {
    setSelectedAssessment(assessment);
    setNotesModalOpen(true);
  };
  
  // Add function to close the notes modal
  const handleCloseNotesModal = () => {
    setNotesModalOpen(false);
    setSelectedAssessment(null);
  };

  // Update name filter when urlUserId changes
  useEffect(() => {
    // If there's a userId in the URL, we'll let the API filter by userId
    // and keep the name filter empty to avoid double filtering
    setFilters(prev => ({ ...prev, name: "" }));
  }, [urlUserId]);
  
  // Function to navigate back to users page
  const handleGoBack = () => {
    navigate(ROUTES.USERS);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            {urlUserId && (
              <button
                onClick={handleGoBack}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-2"
              >
                <svg
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Users
              </button>
            )}
            <h1 className="text-2xl font-semibold text-gray-900">Assessments</h1>
          </div>
          <div className="flex space-x-3">
            {isAnyFilterApplied() && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <button
              onClick={openAssignModal}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Assign Assessment
            </button>
          </div>
        </div>
        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Assessments
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.total}
                  </dd>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                  <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
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
                    Assigned
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.assigned}
                  </dd>
                </div>
                <div className="p-3 bg-indigo-50 rounded-full">
                  <svg
                    className="w-6 h-6 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
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
                    In-Process
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.inProcess}
                  </dd>
                </div>
                <div className="p-3 bg-yellow-50 rounded-full">
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
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
                    Completed
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.completed}
                  </dd>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Filters */}
        {showFilters && (
          <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Filter Assessments
            </h3>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  User Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.name}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label
                  htmlFor="assessmentType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assessment Type
                </label>
                <select
                  id="assessmentType"
                  name="assessmentType"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.assessmentType}
                  onChange={handleFilterChange}
                >
                  <option value="">All Types</option>
                  {assessmentTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.status}
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN-PROCESS">In-Process</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </form>
          </div>
        )}
        {/* Assessments Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Assessment Results
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Showing {filteredAssessments.length} of{" "}
                  {pagination.totalItems} assessments
                </p>
              </div>
              {/* {!loading && filteredAssessments.length > 0 && (
                <div className="flex space-x-2">
                  <button 
                    onClick={openAssignModal}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Assign Assessment
                  </button>
                </div>
              )} */}
            </div>
          </div>
          {loading ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              Loading assessments...
            </div>
          ) : (
            <div className="overflow-x-auto">
              {filteredAssessments.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  No assessments found for the selected criteria.
                </div>
              ) : (
                <AssessmentsTable
                  assessments={filteredAssessments}
                  showFilters={showFilters}
                  onDelete={handleDeleteAssessment}
                  onManageNotes={handleManageNotes}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  totalItems={pagination.totalItems}
                />
              )}
            </div>
          )}
        </div>
        
        {/* Assessment Notes Modal */}
        <AssessmentNotesModal
          isOpen={notesModalOpen}
          onClose={handleCloseNotesModal}
          assessment={selectedAssessment}
        />
      </main>
    </div>
  );
};

export default withNavbar(AssessmentsPage);
