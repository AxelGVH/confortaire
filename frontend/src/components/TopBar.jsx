
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

export default function TopBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-primary text-white px-4 py-3 flex justify-between items-center shadow md:px-6">
      <div className="flex items-center space-x-4">
        <button className="md:hidden" onClick={toggleSidebar}>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-bold">Confortaire</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">{user?.email || "User"}</span>
        <button
          onClick={handleLogout}
          className="bg-white text-primary px-3 py-1 rounded text-sm hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
