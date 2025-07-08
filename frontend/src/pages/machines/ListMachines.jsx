import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Edit, Trash2 } from 'react-feather'; // make sure this import exists


const ListMachines = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [machineRes, depRes, venRes] = await Promise.all([
          axios.get('/machines', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/departments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/vendors', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setMachines(machineRes.data);
        setDepartments(depRes.data);
        setVendors(venRes.data);
      } catch (err) {
        console.error('Error loading machines or metadata:', err);
      }
    };

    fetchData();
  }, []);

    const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this machine?')) return;

    try {
        const token = localStorage.getItem('token');
        await axios.delete(`/machines/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        setMachines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
        console.error('Failed to delete machine:', err);
        alert('Failed to delete machine.');
    }
    };

  const getDeptName = (id) => departments.find((d) => d.id === id)?.name || '-';
  const getVendorName = (id) => vendors.find((v) => v.id === id)?.name || '-';

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Machines', path: '/machines' },
        ]}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600">Machines</h2>
        <button
          onClick={() => navigate('/machines/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Machine
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Model No</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Serial No</th>
              <th className="p-2 border">Voltage</th>
              <th className="p-2 border">Amperes</th>
              <th className="p-2 border">Phase</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {machines.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{m.name}</td>
                <td className="p-2 border">{m.model_no}</td>
                <td className="p-2 border">{getDeptName(m.department_id)}</td>
                <td className="p-2 border">{m.serial_no}</td>
                <td className="p-2 border">{m.voltage}</td>
                <td className="p-2 border">{m.amperes}</td>
                <td className="p-2 border">{m.phase}</td>
                <td className="p-2 border text-center">
                <button
                    onClick={() => navigate(`/machines/edit/${m.id}`)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    title="Edit"
                >
                    <Edit size={18} />
                </button>
                <button
                    onClick={() => handleDelete(m.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
                </td>
              </tr>
            ))}
            {machines.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500 italic">
                  No machines found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListMachines;
