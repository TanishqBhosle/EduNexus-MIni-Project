import React from 'react';
import { useParams } from 'react-router-dom';

const LecturePlayer = () => {
  const { courseId, lectureId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lecture Player</h1>
        <p className="text-gray-600">Course ID: {courseId}</p>
        <p className="text-gray-600">Lecture ID: {lectureId}</p>
        <p className="text-sm text-gray-500 mt-2">This page is under development</p>
      </div>
    </div>
  );
};

export default LecturePlayer;
