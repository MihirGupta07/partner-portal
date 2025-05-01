import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../data/dummyUsers';
import { assessments } from '../data/dummyAssessments';
import { useAuth } from '../utils/AuthContext';
import NavBar from '../components/NavBar';
import NotesModal from '../components/NotesModal';

const UsersPage = () => {
  const { currentPartner } = useAuth();
  const navigate = useNavigate();
  const [partnerUsers, setPartnerUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('registrationDate');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);

  // Load users for this partner
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Get users for this partner
      const filteredUsers = users.filter(user => user.partnerId === currentPartner.id);
      
      // Add assessment data for each user
      const usersWithStats = filteredUsers.map(user => {
        const userAssessments = assessments.filter(a => a.userId === user.id);
        const completedAssessments = userAssessments.filter(a => a.status === 'Completed').length;
        const totalAssessments = userAssessments.length;
        const completionPercentage = totalAssessments > 0 
          ? Math.round((completedAssessments / totalAssessments) * 100) 
          : 0;
        
        return {
          ...user,
          totalAssessments,
          completedAssessments,
          completionPercentage
        };
      });
      
      setPartnerUsers(usersWithStats);
      setLoading(false);
    }, 500);
  }, [currentPartner.id]);

  // Filter users based on search term
  const filteredUsers = partnerUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortField === 'registrationDate' || sortField === 'lastActivity') {
      return sortDirection === 'asc' 
        ? new Date(a[sortField]) - new Date(b[sortField])
        : new Date(b[sortField]) - new Date(a[sortField]);
    }
    
    if (sortField === 'completionPercentage' || sortField === 'totalAssessments') {
      return sortDirection === 'asc' 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Helper for sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  // Open notes modal
  const openNotesModal = (userId) => {
    setSelectedUserId(userId);
    setShowNotesModal(true);
  };

  // Navigate to assessments filtered by user
  const navigateToUserAssessments = (userId) => {
    navigate(`/assessments?userId=${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {loading ? (
              <div className="px-4 py-5 sm:p-6 text-center">Loading users...</div>
            ) : (
              <>
                {partnerUsers.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center">
                    No users found for your organization.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                          >
                            Name{renderSortIndicator('name')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('phone')}
                          >
                            Phone{renderSortIndicator('phone')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('totalAssessments')}
                          >
                            Total Assessments{renderSortIndicator('totalAssessments')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('completionPercentage')}
                          >
                            Completion %{renderSortIndicator('completionPercentage')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('registrationDate')}
                          >
                            Registration Date{renderSortIndicator('registrationDate')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('lastActivity')}
                          >
                            Last Activity{renderSortIndicator('lastActivity')}
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {user.totalAssessments}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.completionPercentage}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div 
                                  className={`h-2.5 rounded-full ${
                                    user.completionPercentage >= 80 ? 'bg-green-600' :
                                    user.completionPercentage >= 50 ? 'bg-yellow-400' :
                                    'bg-red-500'
                                  }`} 
                                  style={{ width: `${user.completionPercentage}%` }}
                                ></div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.registrationDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.lastActivity).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => openNotesModal(user.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View Notes
                              </button>
                              <button
                                onClick={() => openNotesModal(user.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Add Note
                              </button>
                              <button
                                onClick={() => navigateToUserAssessments(user.id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                View Assessments
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      {/* Notes Modal */}
      {showNotesModal && (
        <NotesModal
          userId={selectedUserId}
          onClose={() => setShowNotesModal(false)}
        />
      )}
    </div>
  );
};

export default UsersPage; 