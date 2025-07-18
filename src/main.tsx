import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { UserProvider } from './features/auth/context/UserContext'
import { DocumentTypeProvider } from './features/requests/context/DocumentTypeContext';
import './index.css'
import { router } from './app/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <DocumentTypeProvider>
        <RouterProvider router={router} />
      </DocumentTypeProvider>
    </UserProvider>
  </StrictMode>
)