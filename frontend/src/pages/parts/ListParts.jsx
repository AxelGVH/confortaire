import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { Edit, Trash2 } from 'react-feather';
import Breadcrumb from '../../components/common/Breadcrumb';

const ListParts = () => {
  const navigate = useNavigate();
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');

  const partTypes = ['Consumables', 'Regular', 'Other'];
  const units = ['Count', 'Length', 'Weight', 'Volume', 'Area'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/parts', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setParts(res.data))
    .catch(err => {
      console.error('Failed to load parts:', err);
      alert('Failed to load parts.');
    });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this part?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/parts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParts((prev) => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete part.');
    }
  };

  const filteredParts = parts.filter((p) => {
    const matchesType = !typeFilter || p.part_type === typeFilter;
    const matchesUnit = !unitFilter || p.unit === unitFilter;
    const matchesSearch = !search || p.part_name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesUnit && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Parts', path: '/parts' }]} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-600">Parts</h2>
        <button
          onClick={() => navigate('/parts/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Part
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by part name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Types</option>
          {partTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <select value={unitFilter} onChange={(e) => setUnitFilter(e.target.value)} className="border p-2 rounded">
          <option value="">All Units</option>
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
        <button onClick={() => {
          setSearch('');
          setTypeFilter('');
          setUnitFilter('');
        }} className="bg-gray-100 border rounded px-4 py-2">
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Part No</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Unit</th>
              <th className="p-2 border">Available Qty</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{p.part_name}</td>
                <td className="p-2 border">{p.part_number}</td>
                <td className="p-2 border">{p.part_type}</td>
                <td className="p-2 border">{p.unit}</td>
                <td className="p-2 border">{p.available_qty}</td>
                <td className="p-2 border text-center">
                  <button onClick={() => navigate(`/parts/edit/${p.id}`)} className="text-blue-600 hover:text-blue-800 mr-2" title="Edit">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredParts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 italic p-4">
                  No parts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListParts;
