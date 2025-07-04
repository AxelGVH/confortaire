import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // if editing

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    department_id: '',
    machine_id: '',
    shift_id: '',
    regular_hour_rate: '',
    ot_hour_rate: '',
  });

  const [departments, setDepartments] = useState([]);
  const [machines, setMachines] = useState([]);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchOptions = async () => {
      try {
        const [deptRes, machRes, shiftRes] = await Promise.all([
          axios.get('/departments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/machines', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/shifts', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setDepartments(deptRes.data);
        setMachines(machRes.data);
        setShifts(shiftRes.data);
      } catch (err) {
        console.error('Error loading dropdown options:', err);
      }
    };

    const fetchEmployee = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployee(res.data);
      } catch (err) {
        console.error('Error fetching employee:', err);
      }
    };

    fetchOptions();
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (id) {
        await axios.put(`/employees/${id}`, employee, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/employees', employee, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate('/employees');
    } catch (err) {
      console.error('Error saving employee:', err);
      alert('Failed to save employee.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">{id ? 'Edit' : 'Add'} Employee</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input type="text" name="name" value={employee.name} onChange={handleChange} placeholder="Name" className="border p-2 rounded" required />
        <input type="email" name="email" value={employee.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" required />
        <input type="text" name="phone" value={employee.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" required />

        <select name="department_id" value={employee.department_id} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select name="machine_id" value={employee.machine_id} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Machine</option>
          {machines.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select name="shift_id" value={employee.shift_id} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Select Shift</option>
          {shifts.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input type="number" name="regular_hour_rate" value={employee.regular_hour_rate} onChange={handleChange} placeholder="Regular Hour Rate" className="border p-2 rounded" />
        <input type="number" name="ot_hour_rate" value={employee.ot_hour_rate} onChange={handleChange} placeholder="OT Hour Rate" className="border p-2 rounded" />

        <div className="col-span-2 flex justify-end mt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            {id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
