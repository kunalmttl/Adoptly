import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/main.scss' 
import { CursorProvider } from './context/CursorContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <CursorProvider>
        <App />
      </CursorProvider>
  </StrictMode>,
)
