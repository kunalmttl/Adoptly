// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import CustomCursor from "@/components/common/CustomCursor";

// Import Layouts
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';
import GuestLayout from './layout/GuestLayout'; 


// Import Pages
import HomePage from "@/pages/HomePage";
import BrowsePetsPage from "@/pages/BrowsePetsPage";
import LoginPage from "@/pages/LoginPage";  
import RegisterPage from "@/pages/RegisterPage";
// import AuthLayout from './layout/AuthLayout';
import ListPetPage from "@/pages/ListPetPage";
import MyListingsPage from "@/pages/MyListingsPage";
import PetDetailsPage from './pages/PetDetailsPage';
import UserSettingsPage from './pages/UserSettingsPage';
import EditPetPage from '@/pages/EditPetPage';
import ApplyForAdoptionPage from './pages/ApplyForAdoptionPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ViewApplicationsPage from './pages/ViewApplicationsPage'; 
import NotFoundPage from './pages/NotFoundPage'; 


function App() 
{
  return (
    <Router>
      <Toaster position="top-center" richColors />
      <CustomCursor />
      <Routes>
        {/* --- Group 1: Guest-Only Routes (Login, Register) --- */}
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* --- Group 2: Main App Layout (Browse Page) --- */}
        <Route element={<AppLayout />}>
          <Route path="/browse" element={<BrowsePetsPage />} />
        </Route>

        {/* --- Group 3: Minimal Layout (Most Pages) --- */}
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
        </Route>
        
        {/* ! FIX: Catch-all 404 route must be the last route defined */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;