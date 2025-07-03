import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center">
    <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
    <p className="mb-6 text-gray-600">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="text-blue-600 hover:underline">
      Go back to Dashboard
    </Link>
  </div>
);

export default NotFound;
