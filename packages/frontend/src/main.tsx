// src/main.tsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// --- Global Styles ---
import './index.css'; // Tailwind CSS and custom global styles
import './styles/main.scss'; // Additional global SCSS styles

// --- Root Component & Context ---
import App from './App.tsx';
import { CursorProvider } from './context/CursorContext.tsx';

// Find the root DOM element where the React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element with ID 'root'");
}

// Create a React root and render the application.
createRoot(rootElement).render(
  // StrictMode is a developer tool that highlights potential problems in an application.
  <StrictMode>
    {/* The CursorProvider wraps the entire app, making the custom cursor's
        state available to all components. */}
    <CursorProvider>
      <App />
    </CursorProvider>
  </StrictMode>
);