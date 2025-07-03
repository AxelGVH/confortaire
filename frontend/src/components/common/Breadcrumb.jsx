import React from 'react';
import { useNavigate } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="text-sm text-gray-500 mb-2">
      {items.map((item, index) => (
        <span key={index}>
          {item.path ? (
            <span
              className="cursor-pointer hover:underline text-blue-600"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </span>
          ) : (
            <span>{item.label}</span>
          )}
          {index < items.length - 1 && ' / '}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
