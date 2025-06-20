// src/App.tsx

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import Layouts
import MinimalLayout from './layout/MinimalLayout';
import AppLayout from './layout/AppLayout';

// Import Pages
import HomePage from "@/pages/HomePage";
import BrowsePetsPage from "@/pages/BrowsePetsPage";


function App() 
{
  return (
    <Router>
      <Routes>

        {/* --- Route Group 1: Minimal Layout --- */}
        {/* landing page, register, contact us */}
        <Route element={<MinimalLayout />}>
          <Route 
            path="/" 
            element={<HomePage />} 
          />
        </Route>

        {/* --- Route Group 2: Main App Layout --- */}
        {/* browse pets page */}
        <Route element={<AppLayout />}>
          <Route 
            path="/browse" 
            element={<BrowsePetsPage />} 
          />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;