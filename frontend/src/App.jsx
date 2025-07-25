// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import Login from './pages/auth/Login';
// import Logout from './pages/auth/Logout';
// import MainLayout from './layouts/MainLayout';
// import AuthLayout from './layouts/AuthLayout';
// import AppRoutes from './routes/AppRoutes';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route
//             path="/login"
//             element={
//               <AuthLayout>
//                 <Login />
//               </AuthLayout>
//             }
//           />
//           <Route
//             path="/logout"
//             element={
//               <AuthLayout>
//                 <Logout />
//               </AuthLayout>
//             }
//           />
//           <Route path="/*" element={<AppRoutes />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
import AppRoutes from './routes/AppRoutes';
import './index.css';

function App() {
  return <AppRoutes />;
}

export default App;