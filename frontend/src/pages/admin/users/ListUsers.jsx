import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'react-feather';
import axios from '../../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';



const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); // ✅ must be inside the component
  
useEffect(() => {
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found in localStorage.');
      alert('Please log in again.');
      return;
    }

    try {
      const res = await axios.get('/users'); // No need to manually set headers
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        console.error('Expected an array from /users, got:', res.data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      if (err.response?.status === 401) {
        alert('Session expired. Please log in again.');
        // Optional: Redirect to login page
      } else {
        alert('Failed to load users.');
      }
    }
  };

  fetchUsers();
}, []);


const handleDelete = async (userId) => {
  if (!confirm('Are you sure you want to deactivate this user?')) return;
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(users.map(u =>
      u.id === userId ? { ...u, is_active: false } : u
    ));
    alert('User deactivated');
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Error deactivating user');
  }
};


  return (
    <div className="p-4 bg-white rounded shadow max-w-6xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-blue-600 font-sans">Users</h1>
        <Link
          to="/admin/users/create"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
        >
          + Add User
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Role</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{user.name || '-'}</td>
                <td className="p-2 border-b">{user.email}</td>
                <td className="p-2 border-b capitalize">{user.role}</td>
                <td className="p-2 border-b">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-2 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/users/edit/${user.id}`)} // TODO: replace with actual edit route
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListUsers;
