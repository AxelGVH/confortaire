import React from 'react';
import axios from '../../utils/axiosInstance';
import { X } from 'react-feather';

const AttachmentPanel = ({ files = [], onDeleted }) => {
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await axios.delete(`/upload/attachments/${id}`);
      onDeleted?.(id);
    } catch (err) {
      console.error('Failed to delete attachment', err);
      alert('Failed to delete attachment');
    }
  };

  return (
    <div className="mt-4 space-y-3 overflow-auto max-h-[350px]">
      {files.length === 0 && (
        <p className="text-sm text-gray-500 italic">No attachments yet.</p>
      )}
      {files.map((file) => (
        <div
          key={file.id}
          className="bg-white border border-gray-300 p-3 rounded shadow-sm flex justify-between items-start"
        >
          <div className="flex-1">
            <a
              href={`/${file.file_path}`} // adjust path if needed
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 font-medium hover:underline block truncate"
            >
              {file.file_name}
            </a>
            {file.tags && (
              <p className="text-xs text-gray-500 mt-1">
                Tags: <span className="italic">{file.tags}</span>
              </p>
            )}
          </div>
          <X
            size={16}
            className="text-red-500 cursor-pointer hover:text-red-700 ml-2 mt-1"
            onClick={() => handleDelete(file.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default AttachmentPanel;
