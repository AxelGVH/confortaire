import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import FileUploader from '../../components/common/FileUploader';
import AttachmentPanel from '../../components/common/AttachmentPanel';
import Breadcrumb from '../../components/common/Breadcrumb';

const PartForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    part_name: '',
    part_number: '',
    part_type: '',
    unit: '',
    available_qty: '',
    description: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const partTypes = ['Consumables', 'Regular', 'Other'];
  const units = ['Count', 'Length', 'Weight', 'Volume', 'Area'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchPart = async () => {
      try {
        const res = await axios.get(`/parts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error('Error loading part:', err);
        alert('Failed to load part data');
      }
    };

    const fetchAttachments = async () => {
      try {
        const res = await axios.get(`/upload/attachments?entity_type=part&entity_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedFiles(res.data);
      } catch (err) {
        console.error('Failed to fetch attachments:', err);
      }
    };

    if (isEditMode) {
      fetchPart();
      fetchAttachments();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      if (isEditMode) {
        await axios.put(`/parts/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Part updated');
      } else {
        const res = await axios.post('/parts', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Part created');
        navigate(`/parts/edit/${res.data.id}`); // Enable attachments after save
      }
    } catch (err) {
      console.error('Error saving part:', err);
      alert('Failed to save part.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Parts', path: '/parts' },
          { label: isEditMode ? 'Edit Part' : 'Add Part' },
        ]}
      />
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {isEditMode ? 'Edit Part' : 'Add Part'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Part Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Part Name</label>
            <input
              type="text"
              name="part_name"
              value={form.part_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Part Number</label>
            <input
              type="text"
              name="part_number"
              value={form.part_number}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Part Type</label>
            <select
              name="part_type"
              value={form.part_type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select</option>
              {partTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select</option>
              {units.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Available Qty</label>
            <input
              type="number"
              name="available_qty"
              value={form.available_qty}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>

        {/* Right Column: Upload Panel */}
        <div className="bg-gray-100 rounded-lg p-4 shadow h-full flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            {isEditMode && (
              <FileUploader
                entityType="part"
                entityId={id}
                onUploaded={(file) => setUploadedFiles((prev) => [...prev, file])}
              />
            )}
          </div>
          <AttachmentPanel
            files={uploadedFiles}
            onDeleted={(fileId) =>
              setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default PartForm;
