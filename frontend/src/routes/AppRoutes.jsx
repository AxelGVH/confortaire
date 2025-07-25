// import { Routes, Route, Navigate } from 'react-router-dom';

// // Layouts and Routing
// import PrivateRoute from '../components/routing/PrivateRoute';
// import MainLayout from '../layouts/MainLayout';

// // Pages
// import Dashboard from '../pages/Dashboard';
// import Login from '../pages/auth/Login';
// import Logout from '../pages/auth/Logout';
// import NotFound from '../pages/NotFound';

// // Admin Panel
// import AdminPanel from '../pages/admin/AdminPanel';

// // Admin Modules
// import ListUsers from '../pages/admin/users/ListUsers';
// import UserForm from '../pages/admin/users/UserForm';
// import ListDepartments from '../pages/admin/departments/ListDepartments';
// import DepartmentForm from '../pages/admin/departments/DepartmentForm';
// import ListShifts from '../pages/admin/shifts/ListShifts';
// import ShiftForm from '../pages/admin/shifts/ShiftForm';

// // Vendor Module (general access)
// import ListVendors from '../pages/vendors/ListVendors';
// import VendorForm from '../pages/vendors/VendorForm';

// // Machines Module (general access)
// import ListMachines from '../pages/machines/ListMachines';
// import MachineForm from '../pages/machines/MachineForm';

// // Employees Module (general access)
// import ListEmployees from '../pages/employees/ListEmployees';
// import EmployeeForm from '../pages/employees/EmployeeForm';

// // Parts Module (general access)
// import ListParts from '../pages/parts/ListParts';
// import PartForm from '../pages/parts/PartForm';

// // Activities Module (general access)
// import ListActivities from '../pages/activities/ListActivities';
// import ActivityForm from '../pages/activities/ActivityForm';


// const AppRoutes = () => (
//   <Routes>
//     {/* Redirect root to dashboard */}
//     <Route path="/" element={<Navigate to="/dashboard" />} />

//     {/* Public Auth Routes */}
//     <Route path="/auth/login" element={<Login />} />
//     <Route path="/auth/logout" element={<Logout />} />

//     {/* Protected Dashboard */}
//     <Route
//       path="/dashboard"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <Dashboard />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Admin Panel */}
//     <Route
//       path="/admin"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <AdminPanel />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Admin: Users */}
//     <Route
//       path="/admin/users"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListUsers />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/users/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <UserForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/users/edit/:userId"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <UserForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Admin: Departments */}
//     <Route
//       path="/admin/departments"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListDepartments />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/departments/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <DepartmentForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/departments/edit/:departmentId"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <DepartmentForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Admin: Shifts */}
//     <Route
//       path="/admin/shifts"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListShifts />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/shifts/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ShiftForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/admin/shifts/edit/:shiftId"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ShiftForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Vendors (general access, not admin-only) */}
//     <Route
//       path="/vendors"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListVendors />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/vendors/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <VendorForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/vendors/edit/:id"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <VendorForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/machines"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListMachines />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/machines/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <MachineForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/machines/edit/:id"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <MachineForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     {/* Employees (general access, not admin-only) */}
//     <Route
//       path="/employees"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListEmployees />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/employees/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <EmployeeForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/employees/edit/:id"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <EmployeeForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     {/* Parts (general access) */}
//     <Route
//       path="/parts"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListParts />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/parts/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <PartForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/parts/edit/:id"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <PartForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />

//     {/* Activities (general access) */}
//     <Route
//       path="/activities"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ListActivities />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/activities/create"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ActivityForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
//     <Route
//       path="/activities/edit/:id"
//       element={
//         <PrivateRoute>
//           <MainLayout>
//             <ActivityForm />
//           </MainLayout>
//         </PrivateRoute>
//       }
//     />
    
//     {/* 404 Fallback */}
//     <Route path="*" element={<NotFound />} />
//   </Routes>
// );

// export default AppRoutes;
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Logout from '../pages/auth/Logout';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/login" element={<Login />} />
    <Route path="/logout" element={<Logout />} />
  </Routes>
);

export default AppRoutes;

