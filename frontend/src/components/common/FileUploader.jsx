import React, { useState } from 'react';
import axios from '../../utils/axiosInstance';

const FileUploader = ({ entityType, entityId, onUploaded, maxSizeMB = 10 }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File too large. Max ${maxSizeMB}MB allowed.`);
      return;
    }

    setError('');
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('entity_type', entityType);
    formData.append('entity_id', entityId);
    if (tags) formData.append('tags', tags);

    try {
      setUploading(true);
      const res = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploaded = res.data;
      onUploaded?.(uploaded);

      setSelectedFile(null);
      setTags('');

      // Open or Save?
      const choice = window.confirm('File uploaded successfully. Open now?');
      if (choice) {
        window.open(`/${uploaded.file_path}`, '_blank');
      }

    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="w-full border border-gray-300 px-3 py-2 rounded"
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="button"
        disabled={!selectedFile || uploading}
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>

      {selectedFile && (
        <p className="text-sm text-gray-700">Selected: {selectedFile.name}</p>
      )}
    </div>
  );
};

export default FileUploader;
