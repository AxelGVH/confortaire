import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function DepartmentForm() {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(departmentId);
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
    },
  });

  useEffect(() => {
    console.log('DepartmentForm mounted, isEdit:', isEdit);
    if (isEdit) {
      const fetchDepartment = async () => {
        try {
          console.log('Fetching department', departmentId);
          const res = await axios.get(`/departments/${departmentId}`);
          reset({
                name: res.data.name || '',
                description: res.data.description || '',
                is_active: res.data.is_active ?? true,
                });
          console.log('Fetched:', res.data);
          setValue('name', res.data.name);
          setValue('description', res.data.description || '');
          setValue('is_active', res.data.is_active);
        } catch (err) {
          console.error('Fetch error:', err);
          toast.error('Failed to load department');
        } finally {
          setLoading(false);
        }
      };
      fetchDepartment();
    } else {
      setLoading(false);
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
      navigate('/admin/departments', { replace: true });
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save department');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <input
                id="is_active"
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
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
