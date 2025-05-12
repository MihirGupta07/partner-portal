import { API } from './constants';
import HttpClient from './httpClient';

/**
 * API Service for Ivory Partner Portal
 * Handles authentication and all API calls
 */

// Helper function to handle API responses
// const handleApiResponse = async (response) => {
//   const data = await response.json();
//   if (!response.ok) {
//     throw new Error(data.message || 'An error occurred');
//   }
//   return data;
// };

// API Authentication Services
export const authService = {
  // Partner Portal Authentication
  login: async (identifier, password) => {
    return new Promise((resolve, reject) => {
      HttpClient.post({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.LOGIN}`,
        payload: { identifier, password },
        headers: {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': '' // Override default token for login
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
};

// Partner Portal Services - requires JWT token
export const partnerPortalService = {
  // Assessment Stats
  getAssessmentStats: async (partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.ASSESSMENT_STATS}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Assessment Page Stats - returns total, assigned, inProcess, completed
  getAssessmentPageStats: async (partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.ASSESSMENT_PAGE_STATS}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Assessment Trends
  getAssessmentTrends: async (partnerId, trendType = 'month-on-month') => {
    const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.ASSESSMENT_TRENDS}`);
    url.searchParams.append('partnerId', partnerId);
    url.searchParams.append('trendType', trendType);
    
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: url.toString(),
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Get Assessments
  getAssignedProducts: async (partnerId, status, dateFrom, dateTo, page = 1, limit = 10, userId = null) => {
    const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.ASSIGNED_PRODUCTS}`);
    url.searchParams.append('partnerId', partnerId);
    
    if (status) url.searchParams.append('status', status);
    if (dateFrom) url.searchParams.append('dateFrom', dateFrom);
    if (dateTo) url.searchParams.append('dateTo', dateTo);
    if (userId) url.searchParams.append('userId', userId);
    
    // Add pagination parameters
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: url.toString(),
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // User Stats
  getUserStats: async (partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.USER_STATS}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Get Users
  getUsers: async (partnerId, search = '', page = 1, limit = 10) => {
    const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.USERS}`);
    url.searchParams.append('partnerId', partnerId);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    
    if (search) url.searchParams.append('search', search);
    
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: url.toString(),
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Create User
  createUser: async (userData) => {
    return new Promise((resolve, reject) => {
      HttpClient.post({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.CREATE_USER}`,
        payload: userData,
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Update User
  updateUser: async (userData) => {
    return new Promise((resolve, reject) => {
      HttpClient.put({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.UPDATE_USER}`,
        payload: userData,
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },

  // Soft Delete User
  softDeleteUser: async (userData) => {
    return new Promise((resolve, reject) => {
      HttpClient.put({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.SOFT_DELETE_USER}`,
        payload: userData,
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  searchUser: async (phone) => {
    return new Promise((resolve, reject) => {
      const url = new URL(`${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.SEARCH_USER}`);
      url.searchParams.append('search', phone);
      HttpClient.get({
        url: url.toString(),
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  assignProductToUser: async ({ partnerId, productId, userId }) => {
    return new Promise((resolve, reject) => {
      HttpClient.post({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.ASSIGN_PRODUCT}`,
        payload: { partnerId, productId, userId },
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  getAvailableProducts: async (partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.AVAILABLE_PRODUCTS}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  getRecentActivity: async (partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.GET_RECENT_ACTIVITY}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  // Get consultation report link
  getConsultationReportLink: async (partnerId, consultationReportId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.GET_CONSULTATION_REPORT}/${consultationReportId}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'Failed to get consultation report link'))
      });
    });
  },
  
  // Assessment Notes API methods
  createAssessmentNote: async (partnerId, userId, userProductId, content, createdBy) => {
    return new Promise((resolve, reject) => {
      HttpClient.post({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.CREATE_ASSESSMENT_NOTE}`,
        payload: { partnerId, userId, userProductId, content, createdBy },
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  updateAssessmentNote: async (noteId, partnerId, content, updatedBy) => {
    return new Promise((resolve, reject) => {
      HttpClient.put({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.UPDATE_ASSESSMENT_NOTE}/${noteId}`,
        payload: { partnerId, content, updatedBy },
        headers: {
          headers: {
            'Content-Type': 'application/json'
          }
        },
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  getAssessmentNote: async (noteId, partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.GET_ASSESSMENT_NOTE}/${noteId}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  getAssessmentNotes: async (partnerId, userProductId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.GET_ASSESSMENT_NOTES}/${userProductId}/notes?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  getUserAssessmentNotes: async (partnerId, userId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.GET_USER_ASSESSMENT_NOTES}/${userId}/assessment-notes?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  deleteAssessmentNote: async (noteId, partnerId) => {
    return new Promise((resolve, reject) => {
      HttpClient.delete({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.DELETE_ASSESSMENT_NOTE}/${noteId}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  },
  
  getUserProductWithNotes: async (partnerId, userProductId) => {
    return new Promise((resolve, reject) => {
      HttpClient.get({
        url: `${API.BASE_URL}${API.ENDPOINTS.PARTNER_PORTAL.GET_USER_PRODUCT_WITH_NOTES}/${userProductId}?partnerId=${partnerId}`,
        success: (response) => resolve(response.data),
        failure: (error) => reject(new Error(error.response?.data?.message || 'An error occurred'))
      });
    });
  }
}; 