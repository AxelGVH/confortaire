import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Edit, Trash2 } from 'react-feather';

const ListEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [machines, setMachines] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [filterDepartmentId, setFilterDepartmentId] = useState('');
  const [filterShiftId, setFilterShiftId] = useState('');
  const [searchName, setSearchName] = useState('');
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        const [empRes, deptRes, machRes, shiftRes] = await Promise.all([
          axios.get('/employees', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/departments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/machines', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/shifts', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setEmployees(empRes.data);
        setDepartments(deptRes.data);
        setMachines(machRes.data);
        setShifts(shiftRes.data);
      } catch (err) {
        console.error('Error loading employee data:', err);
      }
    };

    fetchData();
  }, []);

    const filteredEmployees = employees.filter((e) => {
    const matchesDept = !filterDepartmentId || e.department_id === filterDepartmentId;
    const matchesShift = !filterShiftId || e.shift_id === filterShiftId;
    const matchesName = !searchName || e.name.toLowerCase().includes(searchName.toLowerCase());
    return matchesDept && matchesShift && matchesName;
    });

  const getNameById = (list, id) => list.find((item) => item.id === id)?.name || '-';

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Failed to delete employee:', err);
      alert('Failed to delete employee.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Employees', path: '/employees' },
        ]}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600">Employees</h2>
        <button
          onClick={() => navigate('/employees/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>

    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
            type="text"
            placeholder="Search by name"
            className="border p-2 rounded"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />

        <select
            value={filterDepartmentId}
            onChange={(e) => setFilterDepartmentId(e.target.value)}
            className="border p-2 rounded"
        >
            <option value="">All Departments</option>
            {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
            ))}
        </select>

        <select
            value={filterShiftId}
            onChange={(e) => setFilterShiftId(e.target.value)}
            className="border p-2 rounded"
        >
            <option value="">All Shifts</option>
            {shifts.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
            ))}
        </select>

        <button
            className="bg-gray-100 border rounded px-4 py-2"
            onClick={() => {
            setSearchName('');
            setFilterDepartmentId('');
            setFilterShiftId('');
            }}
        >
            Clear Filters
        </button>
    </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Machine</th>
              <th className="p-2 border">Shift</th>
              <th className="p-2 border">Regular Rate</th>
              <th className="p-2 border">OT Rate</th>
              <th className="p-2 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{e.name}</td>
                <td className="p-2 border">{e.email}</td>
                <td className="p-2 border">{e.phone}</td>
                <td className="p-2 border">{getNameById(departments, e.department_id)}</td>
                <td className="p-2 border">{getNameById(machines, e.machine_id)}</td>
                <td className="p-2 border">{getNameById(shifts, e.shift_id)}</td>
                <td className="p-2 border">{e.regular_hour_rate}</td>
                <td className="p-2 border">{e.ot_hour_rate}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => navigate(`/employees/edit/${e.id}`)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500 italic">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListEmployees;
