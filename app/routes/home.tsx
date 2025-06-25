import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Changed from react-router
import { useAuth } from '../auth/AuthContext';
import type { Route } from "./+types/home";
// import { Welcome } from "../welcome/welcome"; // Welcome component might be reused or parts of it

export function meta({}: Route.MetaArgs) { // Assuming Route.MetaArgs is still relevant or defined
  // You might want to adjust meta based on auth state if needed
  return [
    { title: "Stock Dashboard Home" },
    { name: "description", content: "Your personalized stock dashboard." },
  ];
}

export default function HomePage() {
  const { isAuthenticated, isLoading, logout, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><p>Loading application...</p></div>;
  }

  if (!isAuthenticated) {
    // This will typically not be seen due to the useEffect redirect,
    // but it's a good fallback or for initial render before effect runs.
    return null;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">Welcome to Your Dashboard!</h1>
      <p className="mb-4 dark:text-gray-300">You are successfully logged in.</p>
      {/* <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 break-all">
        Access Token: {accessToken ? accessToken.substring(0, 30) + "..." : "N/A"}
      </p> */}
      {/* You can display parts of the Welcome component here or build new dashboard UI */}
      {/* <Welcome /> */}

      <button
        onClick={() => {
          logout();
          // navigate('/login'); // AuthContext logout should trigger redirect via isAuthenticated state change in useEffect
        }}
        className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        Logout
      </button>
    </main>
  );
}
