// # Main Application Router

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import CustomCursor from "@/components/common/CustomCursor";

// * Layouts
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';
import GuestLayout from './layout/GuestLayout'; 

// * Pages
import HomePage from "@/pages/HomePage";
import BrowsePetsPage from "@/pages/BrowsePetsPage";
import LoginPage from "@/pages/LoginPage";  
import RegisterPage from "@/pages/RegisterPage";
import VerifyOTPPage from './pages/VerifyOTPPage';
import ListPetPage from "@/pages/ListPetPage";
import MyListingsPage from "@/pages/MyListingsPage";
import PetDetailsPage from './pages/PetDetailsPage';
import UserSettingsPage from './pages/UserSettingsPage';
import EditPetPage from '@/pages/EditPetPage';
import ApplyForAdoptionPage from './pages/ApplyForAdoptionPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ViewApplicationsPage from './pages/ViewApplicationsPage'; 
import NotFoundPage from './pages/NotFoundPage'; 
import ContactUserPage from './pages/ContactUserPage';


function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <CustomCursor />
      <Routes>
        {/* --- Group 1: Guest-Only Routes (Login, Register, Verify) --- */}
        {/* ! FIX: This route group now correctly wraps all guest-only pages. */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<VerifyOTPPage />} />
        </Route>

        {/* --- Group 2: Main App Layout (Browse Page) --- */}
        <Route element={<AppLayout />}>
          <Route path="/browse" element={<BrowsePetsPage />} />
        </Route>

        {/* --- Group 3: Minimal Layout (All other main pages) --- */}
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;