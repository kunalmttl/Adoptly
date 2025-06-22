// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Layouts
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';

// Import Pages
import HomePage from "@/pages/HomePage";
import BrowsePetsPage from "@/pages/BrowsePetsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthLayout from './layout/AuthLayout';


function App() 
{
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>

        {/* --- Route Group 1: Minimal Layout --- */}
        {/* landing page, register, contact us */}
        <Route element={<MinimalLayout />}>
          <Route 
            path="/" 
            element={<HomePage />} 
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* --- Route Group 2: Main App Layout --- */}
        {/* browse pets page */}
        <Route element={<AppLayout />}>
          <Route 
            path="/browse" 
            element={<BrowsePetsPage />} 
          />
        </Route>

        {/* --- Route Group 3: Auth Layout --- */}
        {/* login, register */}
        <Route element={<AuthLayout />}>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;