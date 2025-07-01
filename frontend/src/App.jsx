import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Logout from './pages/Logout';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AppRoutes from './routes/AppRoutes';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-10">Checking session...</div>;
  }

  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/login" />;
  }

  return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <Login />
              </AuthLayout>
            }
          />
          <Route
            path="/logout"
            element={
              <AuthLayout>
                <Logout />
              </AuthLayout>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <AppRoutes />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
