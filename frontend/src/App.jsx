import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useInitializeAuth } from './start/auth';
import { createRoute } from './start/routes';


// App component
export default function App() {
  useInitializeAuth();

  const router = createRoute();
  return (
    
      <Suspense fallback={<div>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    
  );
};

// Path: frontend/src/start/auth.js

