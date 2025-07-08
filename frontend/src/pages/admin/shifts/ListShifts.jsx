import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { Plus, Edit } from 'react-feather';

export default function ListShifts() {
  const [shifts, setShifts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const res = await axios.get('/shifts');
        setShifts(res.data);
      } catch (err) {
        console.error('Failed to fetch shifts:', err);
      }
    };
    fetchShifts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-800">Shifts</h2>
        <button
          onClick={() => navigate('/admin/shifts/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <Plus size={18} className="mr-1" /> Add Shift
        </button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Shift Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Start Time</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">End Time</th>
              <th className="px-4 py-2 text-sm text-right text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id} className="border-t">
                <td className="px-4 py-2 text-sm">{shift.name}</td>
                <td className="px-4 py-2 text-sm">{shift.start_time}</td>
                <td className="px-4 py-2 text-sm">{shift.end_time}</td>
                <td className="px-4 py-2 text-sm text-right">
                  <button
                    onClick={() => navigate(`/admin/shifts/edit/${shift.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
