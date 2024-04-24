import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import AuthGuard from "../components/Auth";

export const createRoute = () =>{ 
  return createBrowserRouter([
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
    element: (
      <LoginPage />
    ),
  },
  ]) 
}