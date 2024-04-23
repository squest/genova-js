import React, { Suspense, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from './states/credential'; // Define your auth state in Recoil
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

// Auth initializer
function useInitializeAuth() {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const credentials = localStorage.getItem('userCredentials');
    if (credentials) {
      axios.post('/api/validate', { token: credentials })
        .then(response => {
          if (response.data.valid) {
            setAuth({ isAuthenticated: true, user: response.data.user });
          } else {
            localStorage.removeItem('userCredentials');
            setAuth({ isAuthenticated: false });
          }
        })
        .catch(() => setAuth({ isAuthenticated: false }));
    }
  }, [setAuth]);
}

// App component
const App = () => {
  useInitializeAuth();
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthGuard>
          <HomePage />
        </AuthGuard>
      ),
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    // Define other routes and wrap with AuthGuard if needed
  ]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};

// AuthGuard component
const AuthGuard = ({ children }) => {
  const [auth] = useRecoilState(authState);

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return children;
};



