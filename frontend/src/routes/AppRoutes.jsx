
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Departments from '../pages/Departments';
import ListUsers from '../pages/ListUsers';
import ListDepartments from ../pages/ListDepartments;
import UserForm from '../pages/UserForm';
import AdminPanel from '../pages/AdminPanel';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/departments" element={<ListDepartments />} />
    <Route path="/admin/users" element={<ListUsers />} />
    <Route path="/admin/users/create" element={<UserForm />} />
    <Route path="/admin/users/edit/:userId" element={<UserForm />} /> 
  </Routes>
);

export default AppRoutes;
