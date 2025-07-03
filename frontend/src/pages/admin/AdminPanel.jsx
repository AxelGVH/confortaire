import React from 'react';
import { Users, Settings } from 'react-feather';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
  const navigate = useNavigate();

  const options = [
    {
      label: 'Manage Users',
      icon: <Users size={48} className="mb-2 text-blue-600" />,
      onClick: () => navigate('/admin/users'),
    },
    {
      label: 'Manage Departments',
      icon: <Settings size={48} className="mb-2 text-blue-600" />,
      onClick: () => navigate('/admin/departments'),
    },
    {
      label: 'Manage Shifts',
      icon: <Settings size={48} className="mb-2 text-blue-600" />,
      onClick: () => navigate('/admin/shifts'),
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-16 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-800">Admin Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {options.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-xl shadow hover:shadow-md hover:bg-blue-50 transition-all p-8 h-48"
          >
            {item.icon}
            <span className="text-xl font-semibold text-blue-800 mt-2">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
