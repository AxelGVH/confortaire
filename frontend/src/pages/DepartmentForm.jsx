import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function DepartmentForm() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(departmentId);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isEdit) {
      const fetchDepartment = async () => {
        try {
          const res = await axios.get(`/departments/${departmentId}`);
          setValue('name', res.data.name);
          setValue('is_active', res.data.is_active);
        } catch (err) {
          toast.error('Failed to load department');
          console.error(err);
        }
      };
      fetchDepartment();
    } else {
      setValue('is_active', true);
    }
  }, [departmentId, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`/departments/${departmentId}`, data);
        toast.success('Department updated');
      } else {
        await axios.post('/departments/', data);
        toast.success('Department created');
      }
      navigate('/admin/departments/listdepartments');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save department');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        {isEdit ? 'Edit Department' : 'Add New Department'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="is_active"
            type="checkbox"
            {...register('is_active')}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="is_active" className="text-sm">Active</label>
        </div>
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEdit ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/departments/listdepartments')}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
