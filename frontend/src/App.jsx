
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Users from './pages/Users';
import CreateUser from './pages/CreateUser';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Layout from './layouts/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/departments" element={
              <ProtectedRoute roles={['admin']}>
                <Departments />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute roles={['admin']}>
                <Users />
              </ProtectedRoute>
            } />            
            <Route path="/admin/users/create" element={
              <ProtectedRoute roles={['admin']}>
                <CreateUser />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
