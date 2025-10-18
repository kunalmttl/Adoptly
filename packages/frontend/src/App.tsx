// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

// --- Global Components & Utilities ---
import CustomCursor from '@/components/common/CustomCursor';
import ScrollToTop from '@/components/common/ScrollToTop';

// --- Layout Components ---
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';
import GuestLayout from './layout/GuestLayout';

// --- Page Components ---
import HomePage from '@/pages/HomePage';
import BrowsePetsPage from '@/pages/BrowsePetsPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import VerifyOTPPage from './pages/VerifyOTPPage';
import ListPetPage from '@/pages/ListPetPage';
import MyListingsPage from '@/pages/MyListingsPage';
import PetDetailsPage from './pages/PetDetailsPage';
import UserSettingsPage from './pages/UserSettingsPage';
import EditPetPage from '@/pages/EditPetPage';
import ApplyForAdoptionPage from './pages/ApplyForAdoptionPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ViewApplicationsPage from './pages/ViewApplicationsPage';
import NotFoundPage from './pages/NotFoundPage';
import ContactUserPage from './pages/ContactUserPage';

/**
 * The root component of the application.
 * It sets up the router, global components (Toaster, Cursor, ScrollToTop),
 * and defines the entire application's route structure.
 */
function App() {
  return (
    <Router>
      {/* Global components that should be available on every page. */}
      <Toaster position="top-center" richColors />
      <CustomCursor />
      <ScrollToTop />

      <Routes>
        {/* --- Group 1: Guest-Only Routes --- */}
        {/* The GuestLayout acts as a guard, redirecting logged-in users away from these pages. */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* --- Group 2: Main App Layout --- */}
        {/* This layout is for the core "app" experience, like browsing pets. */}
        <Route element={<AppLayout />}>
          <Route path="/browse" element={<BrowsePetsPage />} />
        </Route>

        {/* --- Group 3: Minimal Layout --- */}
        {/* This is the default layout for most other pages. It dynamically changes the header. */}
        <Route element={<MinimalLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/sell" element={<ListPetPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/pets/:id" element={<PetDetailsPage />} />
          <Route path="/pets/:id/edit" element={<EditPetPage />} />
          <Route path="/pets/:id/applications" element={<ViewApplicationsPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/apply/:id" element={<ApplyForAdoptionPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route path="/contact-user" element={<ContactUserPage />} />
        </Route>

        {/* --- Catch-all 404 Route --- */}
        {/* This route matches any URL that wasn't matched by the routes above. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;