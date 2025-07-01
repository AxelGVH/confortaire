import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!!userId);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const isActive = watch('is_active');

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          reset(res.data);
        } catch (err) {
          console.error(err);
          toast.error('Failed to load user');
        } finally {
          setIsLoading(false);
        }
      };
      fetchUser();
    } else {
      // Default to active for new users
      setValue('is_active', true);
    }
  }, [userId, reset, setValue]);

  const onSubmit = async (data) => {
    const token = localStorage.getItem('token');

    // Confirm before deactivation
    if (userId && isActive === false) {
      const confirm = window.confirm('Are you sure you want to deactivate this user?');
      if (!confirm) return;
    }

    try {
      if (userId) {
        await axios.put(`/users/${userId}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User updated successfully!');
      } else {
        await axios.post('/users/', data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User created successfully!');
      }
      setTimeout(() => navigate('/admin/users'), 1000);
    } catch (err) {
      console.error(err);
      toast.error('Error saving user');
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading user...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-semibold mb-6">
        {userId ? 'Edit User' : 'Create New User'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete='off'> 
        <div>
          <label className="block mb-1">Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full border p-2 rounded"
            type="text"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            {...register('email', { required: 'Email is required' })}
            className="w-full border p-2 rounded"
            type="email"
            autoComplete='new-email'
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            {...register('password', {
              required: !userId && 'Password is required for new users',
            })}
            className="w-full border p-2 rounded"
            type="password"
            autoComplete='new-password'
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Role</label>
          <select
            {...register('role', { required: 'Role is required' })}
            className="w-full border p-2 rounded"
          >
            <option value="">Select a role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="is_active"
            type="checkbox"
            {...register('is_active')}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="is_active" className="text-sm">
            Active
          </label>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isSubmitting
              ? userId
                ? 'Updating...'
                : 'Creating...'
              : userId
              ? 'Update User'
              : 'Create User'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="border border-gray-400 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
