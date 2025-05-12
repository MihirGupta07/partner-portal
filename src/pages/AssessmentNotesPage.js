import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import withNavbar from "../components/withNavbar";
import { partnerPortalService } from "../utils/apiService";

const AssessmentNotesPage = () => {
  const { currentPartner, userData } = useAuth();
  const { userProductId } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Fetch assessment details and notes
  useEffect(() => {
    if (!currentPartner?._id || !userProductId) return;
    
    setLoading(true);
    setError("");
    
    partnerPortalService
      .getUserProductWithNotes(currentPartner._id, userProductId)
      .then((response) => {
        setAssessment(response.data);
        setNotes(response.data.notes || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load assessment details and notes");
        console.error(err);
        setLoading(false);
      });
  }, [currentPartner?._id, userProductId]);

  // Create a new note
  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    
    setActionLoading(true);
    setError("");
    
    try {
      await partnerPortalService.createAssessmentNote(
        currentPartner?._id,
        assessment?.user?.id,
        userProductId,
        newNote,
        userData?._id
      );
      
      setNewNote("");
      
      // Refresh notes
      const response = await partnerPortalService.getAssessmentNotes(
        currentPartner._id,
        userProductId
      );
      
      setNotes(response.data || []);
    } catch (err) {
      setError("Failed to create note");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Update an existing note
  const handleUpdateNote = async () => {
    if (!editingNote?.content.trim()) return;
    
    setActionLoading(true);
    setError("");
    
    try {
      await partnerPortalService.updateAssessmentNote(
        editingNote._id,
        currentPartner._id,
        editingNote.content,
        userData._id
      );
      
      setEditingNote(null);
      
      // Refresh notes
      const response = await partnerPortalService.getAssessmentNotes(
        currentPartner._id,
        userProductId
      );
      
      setNotes(response.data || []);
    } catch (err) {
      setError("Failed to update note");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete a note
  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    setActionLoading(true);
    setError("");
    
    try {
      await partnerPortalService.deleteAssessmentNote(noteId, currentPartner._id);
      
      // Refresh notes
      const response = await partnerPortalService.getAssessmentNotes(
        currentPartner._id,
        userProductId
      );
      
      setNotes(response.data || []);
    } catch (err) {
      setError("Failed to delete note");
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Go back to assessments
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-500">Loading assessment details...</div>
      </div>
    );
  }

  if (error && !assessment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
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
              Back to Assessments
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Assessment Notes
            </h1>
          </div>
        </div>

        {/* Assessment details */}
        {assessment && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Assessment Details
                </h2>
              </div>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  assessment.userProduct?.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : assessment.userProduct?.status === "IN-PROCESS"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {assessment.userProduct?.status || "N/A"}
              </span>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">User</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {assessment.user?.name || "N/A"}
                  </dd>
                </div>
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Assessment Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {assessment.product?.name || "N/A"}
                  </dd>
                </div>
                
                <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Date Assigned</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(assessment.userProduct?.createdAt || "N/A")}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatDate(assessment.userProduct?.updatedAt || "N/A")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Notes */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notes</h2>

          {/* Notes list */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No notes found for this assessment.
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="border rounded-md p-4 bg-gray-50"
                >
                  {editingNote && editingNote._id === note._id ? (
                    <div>
                      <textarea
                        className="w-full p-2 border rounded-md mb-2"
                        value={editingNote.content}
                        onChange={(e) =>
                          setEditingNote({
                            ...editingNote,
                            content: e.target.value,
                          })
                        }
                        rows={4}
                        disabled={actionLoading}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm"
                          onClick={() => setEditingNote(null)}
                          disabled={actionLoading}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                          onClick={handleUpdateNote}
                          disabled={actionLoading}
                        >
                          {actionLoading ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-800 mb-4 whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <div>
                          <span className="ml-0">
                            Created: {formatDate(note.createdAt || note.created)} by {note.createdBy?.name || "Unknown"}
                          </span>
                          {note.updatedAt && note.updatedAt !== note.createdAt && (
                            <>
                              <br />
                              <span className="ml-0">
                                Updated: {formatDate(note.updatedAt || note.updated)}
                                {note.updatedBy && (
                                  <span className="ml-1">
                                    by {note.updatedBy.name || "Unknown"}
                                  </span>
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setEditingNote(note)}
                            disabled={actionLoading}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteNote(note._id)}
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add new note */}
          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-800 mb-2">
              Add a new note
            </h3>
            <textarea
              className="w-full p-3 border rounded-md mb-3"
              placeholder="Type your note here..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              rows={4}
              disabled={actionLoading}
            />
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                onClick={handleCreateNote}
                disabled={actionLoading || !newNote.trim()}
              >
                {actionLoading ? "Adding..." : "Add Note"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default withNavbar(AssessmentNotesPage); 