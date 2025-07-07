
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
          {/* ...hamburger icon... */}
        </button>
        <span className="text-lg font-bold">Confortaire</span>
      </div>
      <div className="flex items-center space-x-4">
        {/* {user?.name && <span className="text-sm">{user.name}</span>} */}
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

