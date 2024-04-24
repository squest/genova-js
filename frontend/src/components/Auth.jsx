import React from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../states/credential';
import LoginPage from '../pages/LoginPage';

// AuthGuard component
export default function AuthGuard({ children }) {
  const [auth] = useRecoilState(authState);

  if (!auth.isAuthenticated) {
    return <LoginPage />;
  }

  return children;
}
// Path: frontend/src/pages/HomePage.jsx