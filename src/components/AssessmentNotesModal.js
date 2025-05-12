import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { partnerPortalService } from '../utils/apiService';

const AssessmentNotesModal = ({ isOpen, onClose, assessment }) => {
  const { currentPartner, userData } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState('');

  // Fetch notes when modal opens
  useEffect(() => {
    if (isOpen && assessment?._id) {
      fetchNotes();
    }
  }, [isOpen, assessment]);

  const fetchNotes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await partnerPortalService.getAssessmentNotes(
        currentPartner._id, 
        assessment.userProductId || assessment._id
      );
      setNotes(response.data || []);
    } catch (err) {
      setError('Failed to load assessment notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;
    console.log('CORRECT PAGE')
    setLoading(true);
    setError('');
    try {
        // console.log(currentPartner?._id, assessment?.userId, assessment?.userProductId || assessment?._id, newNote, userData?._id)
      await partnerPortalService.createAssessmentNote(
        currentPartner?._id,
        assessment?.userId,
        assessment?.userProductId || assessment?._id,
        newNote,
        userData?._id
      );
      setNewNote('');
      fetchNotes(); // Refresh notes after creation
    } catch (err) {
      setError('Failed to create note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!editingNote?.content.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      await partnerPortalService.updateAssessmentNote(
        editingNote._id,
        currentPartner._id,
        editingNote.content,
        userData._id
      );
      setEditingNote(null);
      fetchNotes(); // Refresh notes after update
    } catch (err) {
      setError('Failed to update note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    setLoading(true);
    setError('');
    try {
      await partnerPortalService.deleteAssessmentNote(noteId, currentPartner._id);
      fetchNotes(); // Refresh notes after deletion
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Assessment Notes for {assessment?.userName || assessment?.userId}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="max-h-96 overflow-y-auto mb-4">
          {loading && notes.length === 0 ? (
            <p className="text-center py-4 text-gray-500">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No notes found for this assessment.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note._id} className="border rounded-md p-3 bg-gray-50">
                  {editingNote && editingNote._id === note._id ? (
                    <div>
                      <textarea
                        className="w-full p-2 border rounded-md mb-2 text-sm"
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md text-sm"
                          onClick={() => setEditingNote(null)}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                          onClick={handleUpdateNote}
                          disabled={loading}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-800" style={{  whiteSpace: 'pre-wrap' }}>{note.content}</p>
                      <div className="mt-2 flex justify-between items-center text-xs">
                        <div className="text-gray-500">
                          <span>Created: {formatDate(note.createdAt || note.created)}</span>
                          {note.updatedAt !== note.createdAt && (
                            <span> • Updated: {formatDate(note.updatedAt || note.updated)}</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setEditingNote(note)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteNote(note._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t pt-4">
          <textarea
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Add a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
            disabled={loading}
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={handleCreateNote}
              disabled={loading || !newNote.trim()}
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentNotesModal; 