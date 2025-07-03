import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function ShiftForm() {
  const { shiftId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(shiftId);
  const [loading, setLoading] = useState(isEdit);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      start_time: '',
      end_time: '',
      is_active: true
    }
  });

  useEffect(() => {
    if (isEdit) {
      const fetchShift = async () => {
        try {
            const res = await axios.get(`/shifts/${shiftId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
            });
          reset({
            name: res.data.name,
            start_time: res.data.start_time,
            end_time: res.data.end_time,
            is_active: res.data.is_active
          });
        } catch (err) {
          console.error(err);
          toast.error('Failed to load shift');
        } finally {
          setLoading(false);
        }
      };
      fetchShift();
    } else {
      setLoading(false);
    }
  }, [shiftId, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        console.log (localStorage.getItem('token'))
        await axios.put(`/shifts/${shiftId}`, data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        toast.success('Shift updated successfully');
      } else {
        await axios.post('/shifts', data, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
        });
        toast.success('Shift created successfully');
      }
      navigate('/admin/shifts', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error('Error saving shift');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">
        {isEdit ? 'Edit Shift' : 'Add New Shift'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Shift Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full border px-3 py-2 rounded"
            type="text"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block mb-1">Start Time</label>
          <input
            {...register('start_time', { required: 'Start time is required' })}
            className="w-full border px-3 py-2 rounded"
            type="time"
          />
          {errors.start_time && <p className="text-red-500 text-sm">{errors.start_time.message}</p>}
        </div>

        <div>
          <label className="block mb-1">End Time</label>
          <input
            {...register('end_time', { required: 'End time is required' })}
            className="w-full border px-3 py-2 rounded"
            type="time"
          />
          {errors.end_time && <p className="text-red-500 text-sm">{errors.end_time.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Controller
            name="is_active"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
          <label className="text-sm">Active</label>
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
            onClick={() => navigate('/admin/shifts')}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
