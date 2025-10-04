import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 animate-pulse">
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded mr-3"></div>
          <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center text-sm mb-2">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
          <div className="w-1/4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
        <div className="flex items-center text-sm">
          <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
          <div className="w-1/3 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
      <div className="p-4 bg-gray-100 dark:bg-gray-700">
        <div className="w-1/4 h-5 bg-gray-300 dark:bg-gray-600 rounded mx-auto"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
