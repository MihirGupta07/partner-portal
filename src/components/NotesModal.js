import React, { useState, useEffect } from 'react';
import { notes as allNotes } from '../data/dummyNotes';
import { useAuth } from '../utils/AuthContext';

const NotesModal = ({ userId, onClose }) => {
  const { currentPartner } = useAuth();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);

  // Load notes for this user
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const filteredNotes = allNotes.filter(
        note => note.userId === userId && note.partnerId === currentPartner.id
      );
      setNotes(filteredNotes);
      setLoading(false);
    }, 300);
  }, [userId, currentPartner.id]);

  // Add new note
  const handleAddNote = (e) => {
    e.preventDefault();
    
    if (!newNote.trim()) return;
    
    // Create new note object
    const newNoteObj = {
      id: `n${Date.now()}`, // Generate unique ID
      userId,
      partnerId: currentPartner.id,
      text: newNote.trim(),
      author: currentPartner.name,
      timestamp: new Date().toISOString()
    };
    
    // Add to state (in a real app, would send to API)
    setNotes([...notes, newNoteObj]);
    setNewNote('');
  };

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Notes for User {userId}
                </h3>
                
                {loading ? (
                  <div className="mt-4 text-center">Loading notes...</div>
                ) : (
                  <div className="mt-4">
                    {notes.length === 0 ? (
                      <p className="text-gray-500">No notes found for this user.</p>
                    ) : (
                      <ul className="space-y-4 max-h-60 overflow-y-auto">
                        {notes.map(note => (
                          <li key={note.id} className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-800">{note.text}</p>
                            <div className="mt-2 flex justify-between text-xs text-gray-500">
                              <span>{note.author}</span>
                              <span>{new Date(note.timestamp).toLocaleString()}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {/* Add new note form */}
                    <form onSubmit={handleAddNote} className="mt-4">
                      <div className="mb-4">
                        <label htmlFor="new-note" className="block text-sm font-medium text-gray-700">Add Note</label>
                        <textarea
                          id="new-note"
                          name="new-note"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Enter a new note..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add Note
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesModal; 