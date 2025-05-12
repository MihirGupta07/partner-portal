import React from 'react';

const WelcomeBanner = ({ partner }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-4 py-5 sm:p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Welcome to your Partner Dashboard</h3>
        <p className="text-indigo-100">
          {partner?.customMessage || 'Track, manage, and analyze all your assessments in one place.'}
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner; 