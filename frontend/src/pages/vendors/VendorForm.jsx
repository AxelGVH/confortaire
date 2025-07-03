import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import Breadcrumb from '../../components/common/Breadcrumb';

const VendorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    zipcode: '',
    email: '',
    phone: '',
    registration_no: '',
    contact_person_name: '',
    is_active: true,
  });

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchVendor = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in again.');
          return;
        }

        try {
          const res = await axios.get(`/vendors/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setForm(res.data);
        } catch (err) {
          console.error('Failed to load vendor:', err);
          alert('Error fetching vendor details');
        }
      };

      fetchVendor();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in again.');
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(`/vendors/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Vendor updated');
      } else {
        await axios.post('/vendors', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Vendor created');
      }
      navigate('/vendors');
    } catch (err) {
      console.error('Error saving vendor:', err);
      alert('Error saving vendor');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow mt-6 rounded">
      <Breadcrumb
        items={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Vendors', path: '/vendors' },
          { label: isEditMode ? 'Edit Vendor' : 'Add Vendor' },
        ]}
      />

      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        {isEditMode ? 'Edit Vendor' : 'Add Vendor'}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {Object.keys(form).filter(key => key !== 'id').map((key) =>  {
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

          return (
            <div key={key} className="col-span-2 sm:col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="text"
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
    </div>
  );
};

export default VendorForm;
