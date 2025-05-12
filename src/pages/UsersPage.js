import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { useModal } from "../context/ModalContext";
import { useDebounce } from "../utils/hooks";
import { calculateCompletionPercentage } from "../utils/userUtils";
import withNavbar from "../components/withNavbar";
import { partnerPortalService } from "../utils/apiService";
import UsersTable from "../components/UsersTable";
import UserNotesPanel from "../components/UserNotesPanel";

const UsersPage = () => {
  const { currentPartner } = useAuth();
  const { openAssignModal, registerAssessmentCallback } = useModal();
  const navigate = useNavigate();
  const [partnerUsers, setPartnerUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [sortField, setSortField] = useState("createdOn");
  const [sortDirection, setSortDirection] = useState("desc");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  });

  // Add state for user notes panel
  const [selectedUser, setSelectedUser] = useState(null);
  const [showNotes, setShowNotes] = useState(false);

  // Register callback for assessment assignment
  useEffect(() => {
    const handleAssessmentAssigned = () => {
      if (currentPartner?._id) {
        partnerPortalService
          .getUsers(
            currentPartner?._id, 
            searchTerm, 
            pagination.currentPage, // Use current page instead of forcing page 1
            pagination.limit
          )
          .then(({ data }) => {
            setPartnerUsers(data.users || data);
            if (data.pagination) {
              setPagination(prev => ({
                ...prev,
                totalPages: data.pagination.pages || 1,
                totalUsers: data.pagination.totalUsers || 0,
              }));
            }
          })
          .catch((err) => {
            setError(err.message || "Failed to refresh users");
          });
      }
    };

    // Register the callback and get the cleanup function
    const unregister = registerAssessmentCallback(handleAssessmentAssigned);

    // Return the cleanup function to unregister when component unmounts
    return unregister;
  }, [currentPartner?._id, searchTerm, registerAssessmentCallback]); // Remove pagination.limit from dependencies

  // Load users for this partner from API
  useEffect(() => {
    if (!currentPartner?._id) return;
    setLoading(true);
    setError("");
    
    // Fetch all users for stats
    partnerPortalService
      .getUsers(
        currentPartner?._id,
        searchTerm,
        1, // First page
        1000 // Large limit to get all users
      )
      .then(({ data }) => {
        const usersWithCompletion = (data.users || data).map(user => ({
          ...user,
          completionPercentage: calculateCompletionPercentage(user)
        }));
        setAllUsers(usersWithCompletion);
      })
      .catch((err) => {
        console.error("Failed to load all users for stats:", err);
      });

    // Fetch paginated users for table
    partnerPortalService
      .getUsers(
        currentPartner?._id,
        searchTerm,
        pagination.currentPage,
        pagination.limit
      )
      .then(({ data }) => {
        const usersWithCompletion = (data.users || data).map(user => ({
          ...user,
          completionPercentage: calculateCompletionPercentage(user)
        }));
        setPartnerUsers(usersWithCompletion);
        setPagination((prev) => {
          const totalUsers = data.pagination?.totalUsers || (data.users ? data.users.length : 0);
          const limit = data.pagination?.limit || prev.limit;
          const totalPages = data.pagination?.pages || Math.ceil(totalUsers / limit) || 1;
          return {
            ...prev,
            currentPage: data.pagination?.page || prev.currentPage,
            totalPages,
            totalUsers,
            limit,
          };
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load users");
        setLoading(false);
      });
  }, [
    currentPartner?._id,
    searchTerm,
    pagination.currentPage,
    pagination.limit,
  ]);

  // Map API field names to display field names for sorting
  const getApiSortField = (field) => {
    // Map display field names to API field names
    const fieldMap = {
      registrationDate: 'createdOn',
      name: 'name',
      phone: 'phone',
      email: 'email',
      completionPercentage: 'completionPercentage',
      lastActivity: 'lastActivity',
      'totalProducts.total': 'totalProducts.total'
    };
    
    return fieldMap[field] || field;
  };

  // Filter users based on search term (API already does this, but keep for local filtering if needed)
  const filteredUsers = partnerUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const apiSortField = getApiSortField(sortField);
    
    if (apiSortField === "createdOn" || apiSortField === "lastActivity") {
      return sortDirection === "asc"
        ? new Date(a[apiSortField]) - new Date(b[apiSortField])
        : new Date(b[apiSortField]) - new Date(a[apiSortField]);
    }
    if (
      apiSortField === "completionPercentage" ||
      apiSortField === "totalProducts.total"
    ) {
      // Handle nested properties for totalProducts.total
      const aValue = apiSortField.includes('.') 
        ? apiSortField.split('.').reduce((obj, key) => obj?.[key] ?? 0, a)
        : a[apiSortField] || 0;
      
      const bValue = apiSortField.includes('.')
        ? apiSortField.split('.').reduce((obj, key) => obj?.[key] ?? 0, b)
        : b[apiSortField] || 0;
        
      return sortDirection === "asc"
        ? aValue - bValue
        : bValue - aValue;
    }
    // Handle regular string fields with null/undefined checks
    const aVal = a[apiSortField] || '';
    const bVal = b[apiSortField] || '';
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Helper for sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  // Navigate to assessments filtered by user
  const navigateToUserAssessments = (userId) => {
    navigate(`/assessments?userId=${userId}`);
  };

  // User statistics summary
  const stats = {
    totalUsers: pagination.totalUsers,
    engagedUsers: allUsers.filter(user => 
      ((user.totalProducts?.started || 0) + (user.totalProducts?.completed || 0)) > 0
    ).length,
    averageCompletion: allUsers.length
      ? Math.round(
          allUsers.reduce(
            (acc, user) => acc + (user.completionPercentage || 0),
            0
          ) / allUsers.length
        )
      : 0,
    newUsers: allUsers.filter(
      (user) =>
        new Date(user.createdOn) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
  };

  // Handle page change for pagination
  const handlePageChange = (newPage) => {
    if (newPage !== pagination.currentPage) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  // Add function to view user notes
  const handleViewUserNotes = (user) => {
    setSelectedUser(user);
    setShowNotes(true);
  };
  
  // Add function to close user notes panel
  const handleCloseNotes = () => {
    setShowNotes(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search users..."
                className="shadow px-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                {inputValue !== searchTerm ? (
                  <span className="text-xs text-indigo-500 mr-2">
                    Searching...
                  </span>
                ) : null}
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={openAssignModal}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Assign Assessment
            </button>
          </div>
        </div>
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {searchTerm ? (
                      <span>
                        Filtered Users{" "}
                        <span className="text-indigo-500">"{searchTerm}"</span>
                      </span>
                    ) : (
                      "Total Users"
                    )}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.totalUsers}
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
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
                    {searchTerm
                      ? "Filtered Engaged Users"
                      : "Engaged Users"}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.engagedUsers}
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
          <div className="bg-white overflow-hidden shadow-sm rounded-lg transition-all duration-300 hover:shadow-md">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {searchTerm
                      ? "Filtered Avg. Completion Rate"
                      : "Avg. Completion Rate"}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : `${stats.averageCompletion}%`}
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
                    {searchTerm
                      ? "Filtered New Users (7 days)"
                      : "New Users (7 days)"}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {loading ? "..." : stats.newUsers}
                  </dd>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <svg
                    className="w-6 h-6 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {searchTerm ? (
                  <span>
                    Filtered Users{" "}
                    <span className="text-indigo-500 font-normal text-sm">
                      "{searchTerm}"
                    </span>
                  </span>
                ) : (
                  "User Management"
                )}
              </h3>
              <button
                onClick={openAssignModal}
                className="text-sm text-indigo-600 hover:text-indigo-900"
              >
                Add New User
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-4 py-5 sm:p-6 text-center">Loading users...</div>
          ) : (
            <>
              {partnerUsers.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  No users found for your organization.
                </div>
              ) : (
                <UsersTable
                  users={sortedUsers}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  onViewAssessments={navigateToUserAssessments}
                  onViewNotes={handleViewUserNotes}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  totalItems={pagination.totalUsers}
                />
              )}
            </>
          )}
        </div>

        {/* User Notes Modal */}
        {showNotes && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Notes for {selectedUser?.name || selectedUser?.phone}
                </h3>
                <button
                  onClick={handleCloseNotes}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[80vh] overflow-y-auto">
                {console.log(selectedUser)}
                <UserNotesPanel 
                  userId={selectedUser?.id} 
                  userName={selectedUser?.name} 
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default withNavbar(UsersPage);
