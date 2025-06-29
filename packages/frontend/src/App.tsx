// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import CustomCursor from "@/components/common/CustomCursor";

// Import Layouts
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';

// Import Pages
import HomePage from "@/pages/HomePage";
import BrowsePetsPage from "@/pages/BrowsePetsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import AuthLayout from './layout/AuthLayout';
import ListPetPage from "@/pages/ListPetPage";
import MyListingsPage from "@/pages/MyListingsPage";
import PetDetailsPage from './pages/PetDetailsPage';
import UserSettingsPage from './pages/UserSettingsPage';
import EditPetPage from '@/pages/EditPetPage';
import ApplyForAdoptionPage from './pages/ApplyForAdoptionPage';
import MyApplicationsPage from './pages/MyApplicationsPage';


function App() 
{
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <CustomCursor />
      <Routes>

        {/* --- Route Group 1: Minimal Layout --- */}
        {/* landing page, register, contact us */}
        <Route element={<MinimalLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sell" element={<ListPetPage />} />
          <Route path="/pets/:id/edit" element={<EditPetPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/pets/:id" element={<PetDetailsPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/apply/:id" element={<ApplyForAdoptionPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
        </Route>

        {/* --- Route Group 2: Main App Layout --- */}
        {/* browse pets page */}
        <Route element={<AppLayout  />}>
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