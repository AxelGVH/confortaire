import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';
import FileUploader from '../../components/common/FileUploader';
import AttachmentPanel from '../../components/common/AttachmentPanel';

const MachineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    name: '',
    model_no: '',
    department_id: '',
    serial_no: '',
    input_power: '',
    voltage: '',
    amperes: '',
    phase: '',
    vendor_id: '',
    is_active: true,
  });

  const [departments, setDepartments] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load dropdowns and existing data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchMetadata = async () => {
      try {
        const [depRes, venRes] = await Promise.all([
          axios.get('/departments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/vendors', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDepartments(depRes.data);
        setVendors(venRes.data);
      } catch (err) {
        console.error('Error loading departments/vendors', err);
      }
    };

    const fetchMachine = async () => {
      try {
        const res = await axios.get(`/machines/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.error('Error loading machine', err);
      }
    };

    const fetchFiles = async () => {
      try {
        const res = await axios.get(
          `/upload/attachments?entity_type=machine&entity_id=${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUploadedFiles(res.data);
      } catch (err) {
        console.error('Error loading attachments', err);
      }
    };

    fetchMetadata();
    if (isEditMode) {
      fetchMachine();
      fetchFiles();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      if (isEditMode) {
        await axios.put(`/machines/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Machine updated');
      } else {
        const res = await axios.post('/machines', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Machine created');
        navigate(`/machines/edit/${res.data.id}`); // navigate to edit to allow uploads
      }
    } catch (err) {
      console.error('Error saving machine:', err);
      alert('Error saving machine');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Machines', path: '/machines' },
          { label: isEditMode ? 'Edit Machine' : 'Add Machine' },
        ]}
      />
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {isEditMode ? 'Edit Machine' : 'Add Machine'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="md:col-span-2 grid grid-cols-2 gap-4">
          {Object.keys(form).filter((key) => key !== 'id').map((key) => {
            if (key === 'is_active') {
              return (
                <div key={key} className="col-span-2">
                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      name={key}
                      checked={form[key]}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700">Active</span>
                  </label>
                </div>
              );
            }

            if (key === 'department_id') {
              return (
                <div key={key} className="col-span-2 sm:col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Department</label>
                  <select
                    name="department_id"
                    value={form.department_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Select</option>
                    {departments.map((dep) => (
                      <option key={dep.id} value={dep.id}>
                        {dep.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            if (key === 'vendor_id') {
              return (
                <div key={key} className="col-span-2 sm:col-span-1">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Vendor</label>
                  <select
                    name="vendor_id"
                    value={form.vendor_id}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Select</option>
                    {vendors.map((ven) => (
                      <option key={ven.id} value={ven.id}>
                        {ven.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            const isNumeric = ['input_power', 'voltage', 'amperes', 'phase'].includes(key);

            return (
              <div key={key} className="col-span-2 sm:col-span-1">
                <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <input
                  type={isNumeric ? 'number' : 'text'}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            );
          })}
          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {isEditMode ? 'Update' : 'Create'}
            </button>
          </div>
        </form>

        {/* Upload panel */}
        <div className="bg-gray-100 rounded-lg p-4 shadow h-full flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Attachments</h3>
            {isEditMode && (
              <FileUploader
                entityType="machine"
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

export default MachineForm;
