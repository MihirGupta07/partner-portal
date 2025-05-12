// THEME CONSTANTS
export const COLORS = {
  // Brand Colors
  PRIMARY: {
    LIGHT: '#4F46E5', // indigo-600
    DEFAULT: '#3730A3', // indigo-700
    DARK: '#24226A', // indigo-900
  },
  SECONDARY: {
    LIGHT: '#60A5FA', // blue-400
    DEFAULT: '#2563EB', // blue-600
    DARK: '#1E40AF', // blue-800
  },
  // UI Colors
  BACKGROUND: {
    LIGHT: '#FFFFFF',
    DEFAULT: '#F9FAFB', // gray-50
    DARK: '#F3F4F6', // gray-100
  },
  TEXT: {
    LIGHT: '#6B7280', // gray-500
    DEFAULT: '#374151', // gray-700
    DARK: '#1F2937', // gray-800
  },
  // Status Colors
  SUCCESS: {
    LIGHT: '#D1FAE5', // green-100
    DEFAULT: '#10B981', // green-500
    DARK: '#065F46', // green-800
    TEXT: '#065F46', // green-800
  },
  WARNING: {
    LIGHT: '#FEF3C7', // yellow-100
    DEFAULT: '#F59E0B', // yellow-500
    DARK: '#92400E', // yellow-800
    TEXT: '#92400E', // yellow-800
  },
  ERROR: {
    LIGHT: '#FEE2E2', // red-100
    DEFAULT: '#EF4444', // red-500
    DARK: '#991B1B', // red-800
    TEXT: '#991B1B', // red-800
  },
  INFO: {
    LIGHT: '#DBEAFE', // blue-100
    DEFAULT: '#3B82F6', // blue-500
    DARK: '#1E40AF', // blue-800
    TEXT: '#1E40AF', // blue-800
  },
};

export const GRADIENTS = {
  PRIMARY: 'linear-gradient(to right, rgb(24, 42, 125), rgb(37, 99, 235))',
  BACKGROUND: 'linear-gradient(rgb(15, 15, 47), rgb(24, 42, 125))',
};

export const SHADOWS = {
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  LG: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const BORDER_RADIUS = {
  NONE: '0',
  SM: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  MD: '0.375rem', // 6px
  LG: '0.5rem', // 8px
  XL: '0.75rem', // 12px
  FULL: '9999px',
};

// LAYOUT CONSTANTS
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px',
};

export const SPACING = {
  XS: '0.25rem', // 4px
  SM: '0.5rem', // 8px
  MD: '1rem', // 16px
  LG: '1.5rem', // 24px
  XL: '2rem', // 32px
  XXL: '3rem', // 48px
};

// APPLICATION CONSTANTS
export const APP = {
  NAME: 'Ivory Partner Portal',
  VERSION: '0.1.0',
  COPYRIGHT: `© ${new Date().getFullYear()} Ivory`,
  SUPPORT_URL: "https://liveivory.com/about-us#contact",
};

// ROUTES
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ASSESSMENTS: '/assessments',
  USERS: '/users',
  PROFILE: '/profile',
  ASSESSMENT_NOTES: '/assessment/:userProductId/notes',
};

// API CONSTANTS
export const API = {
  BASE_URL: process.env.REACT_APP_API_ENDPOINT,
  ENDPOINTS: {
    // Partner Portal endpoints
    PARTNER_PORTAL: {
      LOGIN: '/v3/partnerPortal/login',
      ASSESSMENT_STATS: '/v3/partnerPortal/assessment-stats',
      ASSESSMENT_PAGE_STATS: '/v3/partnerPortal/assessment-counts',
      ASSESSMENT_TRENDS: '/v3/partnerPortal/assessment-trends',
      ASSIGNED_PRODUCTS: '/v3/partnerPortal/assigned-products',
      USER_STATS: '/v3/partnerPortal/user-stats',
      USERS: '/v3/partnerPortal/users',
      CREATE_USER: '/v3/partnerPortal/create-user',
      UPDATE_USER: '/v3/partnerPortal/update-user',
      SOFT_DELETE_USER: '/v3/partnerPortal/soft-delete-user',
      SEARCH_USER: '/v3/partnerPortal/search-user',
      PARTNER_DETAILS: '/v3/partnerPortal/partner-details',
      ASSIGN_PRODUCT: '/v3/partnerPortal/assign-product-to-user',
      AVAILABLE_PRODUCTS: '/v3/partnerPortal/available-products',
      GET_RECENT_ACTIVITY: '/v3/partnerPortal/recent-activity',
      // Assessment Notes endpoints
      CREATE_ASSESSMENT_NOTE: '/v3/partnerPortal/assessment-notes',
      UPDATE_ASSESSMENT_NOTE: '/v3/partnerPortal/assessment-notes',
      GET_ASSESSMENT_NOTE: '/v3/partnerPortal/assessment-notes',
      GET_ASSESSMENT_NOTES: '/v3/partnerPortal/assessment',
      GET_USER_ASSESSMENT_NOTES: '/v3/partnerPortal/user',
      DELETE_ASSESSMENT_NOTE: '/v3/partnerPortal/assessment-notes',
      GET_USER_PRODUCT_WITH_NOTES: '/v3/partnerPortal/user-product',
      GET_CONSULTATION_REPORT: '/v3/partnerPortal/consultation-report',
    }
  },
};

// STATUS
export const STATUS = {
  ASSIGNED: 'ASSIGNED',
  IN_PROCESS: 'IN-PROCESS',
  COMPLETED: 'COMPLETED',
};

export const STATUS_COLORS = {
  [STATUS.ASSIGNED]: {
    BG: 'bg-yellow-100',
    TEXT: 'text-yellow-800',
  },
  [STATUS.IN_PROCESS]: {
    BG: 'bg-blue-100',
    TEXT: 'text-blue-800',
  },
  [STATUS.COMPLETED]: {
    BG: 'bg-green-100',
    TEXT: 'text-green-800',
  },
};

// ANIMATION
export const ANIMATION = {
  FADE_IN: 'animate-fadeIn',
  SLIDE_DOWN: 'animate-slideDown',
};

// MESSAGES
export const MESSAGES = {
  LOGIN: {
    FAILED: 'Invalid phone number or password. Please try again.',
    SUCCESS: 'Successfully logged in!',
    RESET_SUCCESS: 'Password reset successful!',
  },
  ERRORS: {
    GENERAL: 'Something went wrong. Please try again later.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    INVALID_PASSWORD: 'Password must be at least 6 characters.',
    INVALID_OTP: 'Please enter a valid 6-digit OTP.',
  },
}; 