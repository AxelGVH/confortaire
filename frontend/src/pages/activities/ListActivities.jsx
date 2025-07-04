import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Edit } from 'react-feather';
import Breadcrumb from '../../components/common/Breadcrumb';

const ListActivities = () => {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [machines, setMachines] = useState([]);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [machineFilter, setMachineFilter] = useState('');

  const statusOptions = ['Created', 'In Progress', 'Completed', 'Halted'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [activityRes, machineRes] = await Promise.all([
          axios.get('/activities', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/machines', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setActivities(activityRes.data);
        setMachines(machineRes.data);
      } catch (err) {
        console.error('Failed to load activities or machines:', err);
      }
    };

    fetchData();
  }, []);

  const getMachineName = (id) =>
    machines.find((m) => m.id === id)?.name || '-';

  const filteredActivities = activities.filter((a) => {
    const matchMachine = !machineFilter || a.machine_id === machineFilter;
    const matchStatus = !statusFilter || a.status === statusFilter;
    const matchSearch =
      !search ||
      a.activity_type.toLowerCase().includes(search.toLowerCase()) ||
      a.details.toLowerCase().includes(search.toLowerCase());
    return matchMachine && matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Activities' }]} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600">Activities</h2>
        <button
          onClick={() => navigate('/activities/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Activity
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search activity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={machineFilter}
          onChange={(e) => setMachineFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Machines</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearch('');
            setStatusFilter('');
            setMachineFilter('');
          }}
          className="bg-gray-100 border px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-2 border">Machine</th>
              <th className="p-2 border">Activity Type</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Start Time</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((a) => (
              <tr key={a.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{getMachineName(a.machine_id)}</td>
                <td className="p-2 border">{a.activity_type}</td>
                <td className="p-2 border">{a.priority}</td>
                <td className="p-2 border">{a.status}</td>
                <td className="p-2 border">{a.date}</td>
                <td className="p-2 border">{a.start_time}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => navigate(`/activities/edit/${a.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 italic p-4">
                  No activities found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListActivities;
