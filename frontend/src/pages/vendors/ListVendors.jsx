import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2 } from 'react-feather';
import axios from '../../utils/axiosInstance';

const ListVendors = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in again.');
        return;
      }

      try {
        const res = await axios.get('/vendors');
        if (Array.isArray(res.data)) {
          setVendors(res.data);
        } else {
          setVendors([]);
          console.error('Unexpected response:', res.data);
        }
      } catch (err) {
        console.error('Error loading vendors:', err);
        alert('Failed to load vendor data');
      }
    };

    fetchVendors();
  }, []);

  const handleDelete = async (vendorId) => {
    if (!confirm('Are you sure you want to deactivate this vendor?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVendors(vendors.map(v =>
        v.id === vendorId ? { ...v, is_active: false } : v
      ));
      alert('Vendor deactivated');
    } catch (err) {
      console.error('Error deleting vendor:', err);
      alert('Failed to deactivate vendor');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow max-w-6xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-blue-600 font-sans">Vendors</h1>
        <Link
          to="/vendors/create"
          className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50"
        >
          + Add Vendor
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-200">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border-b">Name</th>
              <th className="p-2 border-b">City</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Phone</th>
              <th className="p-2 border-b">Status</th>
              <th className="p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">{vendor.name}</td>
                <td className="p-2 border-b">{vendor.city}</td>
                <td className="p-2 border-b">{vendor.email}</td>
                <td className="p-2 border-b">{vendor.phone}</td>
                <td className="p-2 border-b">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded ${
                      vendor.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-2 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/vendors/edit/${vendor.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(vendor.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {vendors.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListVendors;
