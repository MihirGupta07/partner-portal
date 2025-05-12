import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import PasswordResetModal from '../components/PasswordResetModal';
import ivoryLogo from '../assets/images/ivwhite.png';
import { ROUTES, GRADIENTS, MESSAGES, APP } from '../utils/constants';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!identifier || !password) {
      setError(MESSAGES.ERRORS.REQUIRED_FIELD);
      setIsLoading(false);
      return;
    }
    
    // Validation for identifier (email or phone)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      setError('Please enter a valid email address or phone number.');
      setIsLoading(false);
      return;
    }
    
    try {
      const result = await login(identifier, password);
      
      if (result.success) {
        navigate(ROUTES.DASHBOARD);
      } else {
        setError(result.message || MESSAGES.LOGIN.FAILED);
      }
    } catch (err) {
      setError(err.message || MESSAGES.LOGIN.FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient with decorative elements */}
      <div className="absolute inset-0 overflow-hidden" style={{ background: GRADIENTS.BACKGROUND }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/2 right-1/3 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative flex w-full max-w-screen-xl mx-auto">
        {/* Left side with login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-start px-8 md:px-16 lg:px-24 py-12 z-10">
          <div className="w-full max-w-md">
            <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden">
              <div className="px-6 py-8 text-center" style={{ background: GRADIENTS.PRIMARY }}>
                
                <p className="text-sm text-white">
                  Sign in to access your partner dashboard
                </p>
              </div>
              
              <div className="px-6 py-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                      Email Address or Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your email or phone number"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            {error}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => setShowResetModal(true)}
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      style={{ background: GRADIENTS.PRIMARY }}
                    >
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                  </div>
                </form>
                
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Need help?</p>
                    <a href={APP.SUPPORT_URL} className="text-sm text-indigo-600 hover:text-indigo-500">
                      Contact support
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center text-sm text-white">
              {APP.COPYRIGHT}
            </div>
          </div>
        </div>
        
        {/* Right side with decorative content - only visible on larger screens */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center">
                <img 
                  src={ivoryLogo} 
                  alt="Ivory Logo" 
                  className="h-auto w-64"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Partner's Workspace</h2>
            <p className="text-xl text-indigo-100 max-w-lg">
              Manage your assessments with our secure and intuitive Partner Workspace. 
              Track progress, view reports, and stay connected with your users.
            </p>
          </div>
        </div>
      </div>
      
      {/* Password Reset Modal */}
      {showResetModal && (
        <PasswordResetModal
          onClose={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
};

export default LoginPage; 