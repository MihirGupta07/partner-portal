# Ivory Partner Portal

A React application for healthcare partners to manage assessments and users. This prototype uses dummy data to simulate the partner portal system.

## Features

- Login with phone/password authentication
- Password reset flow with OTP verification
- Dashboard with assessment statistics and filtering
- Full assessments listing with advanced filtering and sorting
- User management with notes and assessment tracking
- Partner profile information
- Responsive design using Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

Use the following credentials to log in:

- Phone: 555-123-4567
- Password: acme123

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Page components for each route
- `/src/data` - Dummy data to simulate API responses
- `/src/utils` - Utility functions and context providers
- `/src/hooks` - Custom React hooks

## Technologies Used

- React 18
- React Router 7
- Tailwind CSS 4

## Future Enhancements

To develop this prototype into a production application:

1. Replace dummy data with real API calls
2. Add proper authentication with JWT tokens
3. Implement form validation with a library like Formik or React Hook Form
4. Add comprehensive error handling
5. Develop an admin panel for partner management
6. Implement testing with Jest and React Testing Library

## Notes for Developers

- The authentication is simulated with localStorage. In a real app, you would use secure cookies and proper authentication tokens.
- All filtering, sorting, and CRUD operations are client-side only and not persisted across page refreshes.
- The OTP for password reset is hardcoded as "123456" for demo purposes.
- User IDs in the assessment table would be replaced with actual names in a real application.
