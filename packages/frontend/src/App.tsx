// # Main Application Routing
// * Configures routes for the Adoptly app using React Router with layouts.

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomCursor from "@/components/common/CustomCursor";

// * Import Layouts
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';
import AuthLayout from './layout/AuthLayout';

// * Import Pages
import HomePage from "@/pages/HomePage";
import BrowsePetsPage from "@/pages/BrowsePetsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ListPetPage from "@/pages/ListPetPage";
import MyListingsPage from "@/pages/MyListingsPage";
import PetDetailsPage from './pages/PetDetailsPage';
import UserSettingsPage from './pages/UserSettingsPage';
// import EditPetPage from '@/pages/EditPetPage';
import ApplyForAdoptionPage from './pages/ApplyForAdoptionPage';

function App() {
  return (
    <Router>
      <Toaster />
      <CustomCursor />
      <Routes>
        {/* * Route Group 1: Minimal Layout */}
        {/* =-= Landing page, pet details, and user actions */}
        <Route element={<MinimalLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="sell" element={<ListPetPage />} />
          <Route path="my-listings" element={<MyListingsPage />} />
          <Route path="pet/:id" element={<PetDetailsPage />} />
          <Route path="apply-for-adoption/:petId" element={<ApplyForAdoptionPage />} />
          <Route path="settings" element={<UserSettingsPage />} />
        </Route>

        {/* * Route Group 2: Main App Layout */}
        {/* =-= Browse pets page */}
        <Route element={<AppLayout />}>
          <Route path="browse" element={<BrowsePetsPage />} />
        </Route>

        {/* * Route Group 3: Auth Layout */}
        {/* =-= Login, register */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;