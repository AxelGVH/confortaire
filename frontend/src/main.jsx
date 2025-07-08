import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { SidebarProvider } from './context/SidebarContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ Wrap everything inside */}
      <SidebarProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>
);
