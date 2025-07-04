import { useSidebar } from '../context/SidebarContext';
import { NavLink } from 'react-router-dom';
import { Home, Settings, UserCheck, Tool, Users, Package } from 'react-feather';

export default function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <div
      className={`${
        isOpen ? 'block' : 'hidden'
      } md:block w-64 bg-white border-r border-gray-200 min-h-full p-4 md:static z-10`}
    >
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/Vendors"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <UserCheck size={18} />
          <span>Vendors</span>
        </NavLink>

        <NavLink
          to="/machines"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded ${
              isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Tool size={18} />
          Machines
        </NavLink>

        <NavLink
          to="/employees"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded ${
              isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Users size={18} />
          Employees
        </NavLink>

        <NavLink
          to="/parts"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded ${
              isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Package size={18} />
          Parts
        </NavLink>          

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center space-x-2 px-4 py-2 rounded ${
              isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings size={18} />
          <span>Admin Panel</span>
        </NavLink>
      </nav>
    </div>
  );
}
