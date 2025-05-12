import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { partnerPortalService } from '../utils/apiService';

const UserNotesPanel = ({ userId, userName }) => {
  const { currentPartner } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedNote, setExpandedNote] = useState(null);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserNotes();
    }
  }, [userId]);

  const fetchUserNotes = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all notes (both assessment and user-level) from a single API call
      const response = await partnerPortalService.getUserAssessmentNotes(
        currentPartner._id, 
        userId
      );
      
      const allNotes = [];
      
      // Process assessment notes
      if (response.data && response.data.assessments) {
        response.data.assessments.forEach(assessment => {
          if (assessment.notes && assessment.notes.length > 0) {
            const notesWithAssessmentInfo = assessment.notes.map(note => ({
              ...note,
              assessmentId: assessment._id,
              userProductId: assessment.userProductId,
              assessmentName: assessment.productName || 'Unlabeled Assessment',
              assessmentDate: assessment.created || assessment.createdAt
            }));
            allNotes.push(...notesWithAssessmentInfo);
          }
        });
      }

      // Process user-level notes (that aren't tied to assessments)
      if (response.data && response.data.generalNotes && response.data.generalNotes.length > 0) {
        const userLevelNotes = response.data.generalNotes.map(note => ({
          ...note,
          isUserLevelNote: true
        }));
        allNotes.push(...userLevelNotes);
      }
      
      setNotes(allNotes);
    } catch (err) {
      setError('Failed to load user notes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const toggleNoteExpansion = (noteId) => {
    if (expandedNote === noteId) {
      setExpandedNote(null);
    } else {
      setExpandedNote(noteId);
    }
  };

  const handleAddNoteClick = () => {
    setShowAddNoteForm(true);
  };

  const handleCancelNote = () => {
    setShowAddNoteForm(false);
    setNewNoteContent('');
  };

  const handleSubmitNote = async () => {
    if (!newNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      // Add a user-level note (not tied to any assessment)
      await partnerPortalService.createAssessmentNote(
        currentPartner._id,
        userId,
        null, // No userProductId for user-level notes
        newNoteContent,
        currentPartner._id
      );
      
      // Refresh notes
      await fetchUserNotes();
      
      // Reset form
      setNewNoteContent('');
      setShowAddNoteForm(false);
    } catch (err) {
      setError('Failed to add note');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-8"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  // Group notes by assessment ID instead of name
  const groupedNotes = notes?.reduce((groups, note) => {
    // For user-level notes
    if (note.isUserLevelNote) {
      if (!groups['user-level']) {
        groups['user-level'] = {
          notes: [],
          name: 'General Notes',
          isUserLevel: true
        };
      }
      groups['user-level'].notes.push(note);
      return groups;
    }

    // For assessment notes
    const assessmentId = note.userProductId || 'unknown';
    if (!groups[assessmentId]) {
      groups[assessmentId] = {
        notes: [],
        name: note.assessmentName || 'Unlabeled Assessment',
        date: note.assessmentDate
      };
    }
    groups[assessmentId].notes.push(note);
    return groups;
  }, {});

  // Sort notes within each group by date (newest first)
  Object.values(groupedNotes).forEach(group => {
    group.notes.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created);
      const dateB = new Date(b.createdAt || b.created);
      return dateB - dateA;
    });
  });

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Notes for {userName}</h2>
        {!showAddNoteForm && (
          <button 
            onClick={handleAddNoteClick}
            className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Add Note
          </button>
        )}
      </div>

      {showAddNoteForm && (
        <div className="mb-4 p-4 border rounded-md bg-white">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Add a note about this user..."
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
          />
          <div className="mt-2 flex justify-end space-x-2">
            <button
              onClick={handleCancelNote}
              className="px-3 py-1 border text-gray-600 rounded-md text-sm hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitNote}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
              disabled={isSubmitting || !newNoteContent.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 && !showAddNoteForm ? (
        <div className="p-6 text-center text-gray-500">No notes found for this user.</div>
      ) : (
        // Show user-level notes first if they exist
        Object.entries(groupedNotes).sort(([keyA], [keyB]) => {
          // Sort user-level notes to appear first
          if (keyA === 'user-level') return -1;
          if (keyB === 'user-level') return 1;
          return 0;
        }).map(([groupId, group]) => (
          <div key={groupId} className="mb-6">
            <h3 className="text-md font-medium text-gray-800 mb-3 border-b pb-2">
              {group.isUserLevel ? group.name : `${group.name} ${group.date ? `(${formatShortDate(group.date)})` : ''}`}
            </h3>
            <div className="space-y-4">
            {group.notes.map((note) => (
                <div key={note._id} className="border rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition duration-150">
                  <div 
                    className={`text-sm text-gray-800 ${expandedNote === note._id ? '' : 'line-clamp-3'}`}
                    onClick={() => toggleNoteExpansion(note._id)}
                    style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }}
                  >
                    {note.content}
                  </div>
                  <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
                    <div>
                      <span>Created: {formatDate(note.createdAt || note.created)}</span>
                      {note.updatedAt !== note.createdAt && note.updatedAt && (
                        <span> • Updated: {formatDate(note.updatedAt || note.updated)}</span>
                      )}
                    </div>
                    <button 
                      className="text-indigo-600 text-xs font-medium hover:text-indigo-800"
                      onClick={() => toggleNoteExpansion(note._id)}
                    >
                      {expandedNote === note._id ? 'Show less' : 'Show more'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserNotesPanel; 