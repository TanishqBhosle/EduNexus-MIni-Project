import React from 'react';
import { useParams } from 'react-router-dom';

const AssignmentDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Assignment Detail</h1>
        <p className="text-gray-600">Assignment ID: {id}</p>
        <p className="text-sm text-gray-500 mt-2">This page is under development</p>
      </div>
    </div>
  );
};

export default AssignmentDetail;
