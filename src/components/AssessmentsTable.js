import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import ScoreChartModal from "./ScoreChartModal";
import { STATUS, STATUS_COLORS, COLORS } from "../utils/constants";
import { partnerPortalService } from "../utils/apiService";

const AssessmentsTable = ({
  assessments,
  showFilters = false,
  onDelete,
  pagination = null,
  onPageChange = null,
  totalItems = 0,
}) => {
  const { currentPartner } = useAuth();
  const [sortField, setSortField] = useState("created");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [showScoreModal, setShowScoreModal] = useState(false);

  const rowsPerPage = 10;

  // Sorting function
  const sortedAssessments = [...assessments].sort((a, b) => {
    if (sortField === "created") {
      const dateA = new Date(a.createdOn || a.created);
      const dateB = new Date(b.createdOn || b.created);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortField === "updated") {
      const dateA = new Date(a.updatedOn || a.updated);
      const dateB = new Date(b.updatedOn || b.updated);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (sortField === "assessmentName") {
      const valueA = a.assessmentType || a.assessmentName || "";
      const valueB = b.assessmentType || b.assessmentName || "";
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    }

    // For other fields
    if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Use server pagination if provided, otherwise use client-side pagination
  const isServerPagination = pagination !== null && onPageChange !== null;

  // Client-side pagination (only used if server pagination is not provided)
  const totalPages = isServerPagination
    ? pagination.totalPages
    : Math.ceil(sortedAssessments.length / rowsPerPage);

  const currentAssessments = isServerPagination
    ? sortedAssessments // When using server pagination, we display all received assessments
    : sortedAssessments.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
      );

  // Handle page change
  const handlePageChange = (newPage) => {
    if (isServerPagination) {
      // Use the callback for server pagination
      onPageChange(newPage);
    } else {
      // Use local state for client pagination
      setCurrentPage(newPage);
    }
  };

  // Sorting handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // For score chart modal
  const openScoreModal = (assessmentId) => {
    setSelectedAssessment(
      assessments.find((a) => (a._id || a.id) === assessmentId)
    );
    setShowScoreModal(true);
  };

  // Helper for sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? " ↑" : " ↓";
  };

  // Get the actual current page
  const displayCurrentPage = isServerPagination
    ? pagination.currentPage
    : currentPage;

  // Handle consultation report download
  const handleDownloadReport = async (consultationReportId) => {
    try {
      const {data:result} = await partnerPortalService.getConsultationReportLink(
        currentPartner?._id,
        consultationReportId
      );
      
      if (result && result.reportLink) {
        // Open the report URL in a new tab or trigger a download
        window.open(result.reportLink, '_blank');
      }
    } catch (error) {
      console.error("Error downloading consultation report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("userId")}
            >
              User Name{renderSortIndicator("userId")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("assessmentName")}
            >
              Assessment Type{renderSortIndicator("assessmentName")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("status")}
            >
              Status{renderSortIndicator("status")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("created")}
            >
              Created{renderSortIndicator("created")}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("updated")}
            >
              Updated{renderSortIndicator("updated")}
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
          {currentAssessments.map((assessment) => (
            <tr key={assessment._id || assessment.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {assessment.userName || assessment.userId}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {assessment.assessmentType || assessment.assessmentName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    STATUS_COLORS[assessment.status]?.BG || "bg-gray-100"
                  } ${
                    STATUS_COLORS[assessment.status]?.TEXT || "text-gray-800"
                  }`}
                >
                  {assessment.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(
                  assessment.createdOn || assessment.created
                ).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(
                  assessment.updatedOn || assessment.updated
                ).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {/* Notes link */}
                <Link
                  to={`/assessment/${
                    assessment.userProductId || assessment._id
                  }/notes`}
                  className="text-purple-600 hover:text-purple-900"
                >
                  Notes
                </Link>

                {assessment.status === STATUS.ASSIGNED && onDelete && (
                  <button
                    onClick={() => onDelete(assessment._id || assessment.id)}
                    className="text-red-600 hover:text-red-900 ml-2"
                  >
                    Delete
                  </button>
                )}
                {assessment.status === STATUS.COMPLETED && (
                
                  <>
                  {console.log(assessment)}
                  {assessment.consultationReport && (
                    <button 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => handleDownloadReport(assessment.consultationReport)}
                    >
                      Download Report
                    </button>
                  )}

                    <button
                      onClick={() =>
                        openScoreModal(assessment._id || assessment.id)
                      }
                      className="text-orange-600 hover:text-orange-900"
                    >
                      View Values
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() =>
                handlePageChange(Math.max(1, displayCurrentPage - 1))
              }
              disabled={displayCurrentPage === 1}
              className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                displayCurrentPage === 1
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, displayCurrentPage + 1))
              }
              disabled={displayCurrentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                displayCurrentPage === totalPages
                  ? "text-gray-300"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(displayCurrentPage - 1) * rowsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {isServerPagination
                    ? Math.min(displayCurrentPage * rowsPerPage, totalItems)
                    : Math.min(
                        displayCurrentPage * rowsPerPage,
                        sortedAssessments.length
                      )}
                </span>{" "}
                of{" "}
                <span className="font-medium">
                  {isServerPagination ? totalItems : sortedAssessments.length}
                </span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, displayCurrentPage - 1))
                  }
                  disabled={displayCurrentPage === 1}
                  className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                    displayCurrentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  &#8592;
                </button>

                {/* Generate page buttons but limit display for large page counts */}
                {(() => {
                  const buttons = [];
                  const maxButtons = 5;
                  let startPage = Math.max(
                    1,
                    displayCurrentPage - Math.floor(maxButtons / 2)
                  );
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxButtons - 1
                  );

                  // Adjust if showing less than maxButtons
                  if (endPage - startPage + 1 < maxButtons) {
                    startPage = Math.max(1, endPage - maxButtons + 1);
                  }

                  // Show first page if not in range
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
                        <span
                          key="ellipsis1"
                          className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                  }

                  // Page buttons
                  for (let i = startPage; i <= endPage; i++) {
                    buttons.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`relative inline-flex items-center border ${
                          displayCurrentPage === i
                            ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                        } px-4 py-2 text-sm font-medium`}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Show last page if not in range
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      buttons.push(
                        <span
                          key="ellipsis2"
                          className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
                        >
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
                  onClick={() =>
                    handlePageChange(
                      Math.min(totalPages, displayCurrentPage + 1)
                    )
                  }
                  disabled={displayCurrentPage === totalPages}
                  className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium ${
                    displayCurrentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
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

      {/* Modals */}
      {showScoreModal && (
        <ScoreChartModal
          assessment={selectedAssessment}
          onClose={() => setShowScoreModal(false)}
        />
      )}
    </div>
  );
};

export default AssessmentsTable;
