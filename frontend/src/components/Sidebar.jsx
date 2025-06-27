
import { useSidebar } from '../context/SidebarContext';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`\${isOpen ? 'block' : 'hidden'} md:block w-64 bg-white border-r border-gray-200 min-h-full p-4 fixed md:static z-20`}
    >
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `px-4 py-2 rounded \${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `px-4 py-2 rounded \${isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`
          }
        >
          Admin Panel
        </NavLink>
      </nav>
    </div>
  );
}
