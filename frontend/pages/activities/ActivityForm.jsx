import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';
import FileUploader from '../../components/common/FileUploader';
import AttachmentPanel from '../../components/common/AttachmentPanel';

const ActivityForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    machine_id: '',
    activity_type: '',
    priority: 'Medium',
    status: 'Created',
    date: '',
    start_time: '',
    required_time: '',
    details: '',
  });

  const [machines, setMachines] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const priorities = ['Low', 'Medium', 'High'];
  const statuses = ['Created', 'In Progress', 'Completed', 'Halted'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchMachines = async () => {
      try {
        const res = await axios.get('/machines', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMachines(res.data);
      } catch (err) {
        console.error('Error loading machines', err);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await axios.get(`/activities/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error('Error loading activity', err);
        alert('Failed to load activity');
      }
    };

    const fetchAttachments = async () => {
      try {
        const res = await axios.get(`/upload/attachments?entity_type=activity&entity_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUploadedFiles(res.data);
      } catch (err) {
        console.error('Error loading attachments:', err);
      }
    };

    fetchMachines();
    if (isEditMode) {
      fetchActivity();
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
    if (!token) return;

    try {
      if (isEditMode) {
        await axios.put(`/activities/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Activity updated');
      } else {
        const res = await axios.post('/activities', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Activity created');
        navigate(`/activities/edit/${res.data.id}`);
      }
    } catch (err) {
      console.error('Error saving activity:', err);
      alert('Failed to save activity.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Activities', path: '/activities' },
          { label: isEditMode ? 'Edit Activity' : 'Add Activity' },
        ]}
      />
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {isEditMode ? 'Edit Activity' : 'Add Activity'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Machine</label>
            <select
              name="machine_id"
              value={form.machine_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Machine</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Activity Type</label>
            <select
            name="activity_type"
            value={form.activity_type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            >
            <option value="">Select Type</option>
            <option value="Preventive">Preventive</option>
            <option value="On Spot">On Spot</option>
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Priority</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-700">Required Time (hrs)</label>
            <input
            type="time"
            name="required_time"
            value={form.required_time}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Activity Details</label>
            <textarea
              name="details"
              value={form.details}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
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

        {/* Right: Upload Panel */}
        <div className="bg-gray-100 rounded-lg p-4 shadow h-full flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            {isEditMode && (
              <FileUploader
                entityType="activity"
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

export default ActivityForm;
