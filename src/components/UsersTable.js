import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsersTable = ({ 
  users, 
  onSort,
  sortField,
  sortDirection,
  pagination = null,
  onPageChange = null,
  totalItems = 0,
  onViewAssessments,
  onViewNotes
}) => {
  const rowsPerPage = pagination?.limit || 10;

  const isServerPagination = pagination !== null && onPageChange !== null;
  const totalPages = isServerPagination 
    ? pagination.totalPages
    : Math.ceil(users.length / rowsPerPage);
    
  // Get the current page of users for display
  const currentUsers = isServerPagination 
    ? users 
    : users.slice((pagination?.currentPage - 1) * rowsPerPage, pagination?.currentPage * rowsPerPage);

  const handlePageChange = (newPage) => {
    if (isServerPagination) {
      onPageChange(newPage);
    }
  };

  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const displayCurrentPage = isServerPagination ? pagination.currentPage : 1;

  // Field mapping for display
  const mapFieldToDisplay = (user, field) => {
    switch(field) {
      case 'registrationDate':
        return user.createdOn ? new Date(user.createdOn).toLocaleDateString() : 'N/A';
      case 'lastActivity':
        return user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'Never';
      case 'totalProducts.total':
        return user.totalProducts?.total || 0;
      default:
        return user[field];
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              onClick={() => onSort('name')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Name{renderSortIndicator('name')}
            </th>
            <th 
              onClick={() => onSort('phone')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Phone{renderSortIndicator('phone')}
            </th>
            <th 
              onClick={() => onSort('totalProducts.total')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Total Assessments{renderSortIndicator('totalProducts.total')}
            </th>
            <th 
              onClick={() => onSort('completionPercentage')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Completion %{renderSortIndicator('completionPercentage')}
            </th>
            <th 
              onClick={() => onSort('registrationDate')}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            >
              Registration Date{renderSortIndicator('registrationDate')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-medium text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.totalProducts?.total || 0} Total
                </div>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mr-2"></span>
                    <span className="text-gray-600">
                      {user.totalProducts?.assigned || 0} Assigned
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    <span className="text-gray-600">
                      {user.totalProducts?.started || 0} In Progress
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-gray-600">
                      {user.totalProducts?.completed || 0} Completed
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {user.completionPercentage}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className={`h-2.5 rounded-full ${
                      user.completionPercentage >= 80 ? "bg-green-600" :
                      user.completionPercentage >= 50 ? "bg-yellow-400" : "bg-red-500"
                    }`}
                    style={{ width: `${user.completionPercentage}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.createdOn ? new Date(user.createdOn).toLocaleDateString() : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewAssessments(user.id);
                  }}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  View Assessments
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewNotes && onViewNotes(user);
                  }}
                  className="text-green-600 hover:text-green-900"
                >
                  View Notes
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, displayCurrentPage - 1))}
              disabled={displayCurrentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                displayCurrentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, displayCurrentPage + 1))}
              disabled={displayCurrentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                displayCurrentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(displayCurrentPage - 1) * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(displayCurrentPage * rowsPerPage, isServerPagination ? totalItems : users.length)}
                </span>{' '}
                of <span className="font-medium">{isServerPagination ? totalItems : users.length}</span> users
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(1, displayCurrentPage - 1))}
                  disabled={displayCurrentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                    displayCurrentPage === 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  &#8592;
                </button>
                {/* Generate page buttons but limit display for large page counts */}
                {(() => {
                  const buttons = [];
                  const maxButtons = 5;
                  let startPage = Math.max(1, displayCurrentPage - Math.floor(maxButtons / 2));
                  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
                  if (endPage - startPage + 1 < maxButtons) {
                    startPage = Math.max(1, endPage - maxButtons + 1);
                  }
                  if (startPage > 1) {
                    buttons.push(
                      <button
                        key="1"
                        onClick={() => handlePageChange(1)}
                        className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      buttons.push(
                        <span key="ellipsis1" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                  }
                  for (let i = startPage; i <= endPage; i++) {
                    buttons.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`relative inline-flex items-center border ${
                          displayCurrentPage === i
                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                        } px-4 py-2 text-sm font-medium`}
                      >
                        {i}
                      </button>
                    );
                  }
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      buttons.push(
                        <span key="ellipsis2" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                          ...
                        </span>
                      );
                    }
                    buttons.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  return buttons;
                })()}
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, displayCurrentPage + 1))}
                  disabled={displayCurrentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                    displayCurrentPage === totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  &#8594;
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable; 