import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useWorkspace } from '../context/WorkspaceContext';
import withNavbar from '../components/withNavbar';
import { partnerPortalService } from '../utils/apiService';

const ProfilePage = () => {
  const { userData } = useAuth();
  const { currentWorkspace } = useWorkspace();
  const [partnerProfile, setPartnerProfile] = useState(currentWorkspace);
  const [userProfile, setUserProfile] = useState(userData);
  const [activeTab, setActiveTab] = useState('information');

  // If a real API endpoint for partner profile exists, fetch it here
  useEffect(() => {
    // Example: Uncomment and adjust if such an endpoint exists
    // if (!currentWorkspace?.id || !token) return;
    // setLoading(true);
    // setError('');
    // partnerPortalService.getPartnerProfile(currentWorkspace.id, token)
    //   .then(data => {
    //     setPartnerProfile(data.partner || data);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setError(err.message || 'Failed to load profile');
    //     setLoading(false);
    //   });
    setPartnerProfile(currentWorkspace);
    setUserProfile(userData);
  }, [currentWorkspace, userData]);


  if (!partnerProfile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">No profile data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            <p className="text-indigo-100">
              View and manage your profile and workspace settings
            </p>
          </div>
          
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('information')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'information'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Information
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preferences'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preferences
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          {activeTab === 'information' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">User Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Name</span>
                      <span className="text-sm text-gray-900">{userProfile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Email</span>
                      <span className="text-sm text-gray-900">{userProfile?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Current Workspace</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Partner Name</span>
                      <span className="text-sm text-gray-900">{partnerProfile?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Support Email</span>
                      <span className="text-sm text-gray-900">{partnerProfile?.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-500">Phone Number</span>
                      <span className="text-sm text-gray-900">{partnerProfile?.phone}</span>
                    </div>
                  </div>
                </div>
               
              </div>
            </div>
          )}
          
          {activeTab === 'preferences' && (
            <div className="p-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Preference settings are not yet available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'security' && (
            <div className="p-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Security settings are not yet available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withNavbar(ProfilePage); 