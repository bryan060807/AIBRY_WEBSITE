import React from 'react';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "Weaving your masterpiece..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
        <p className="text-indigo-300 font-medium">{message}</p>
        <p className="text-sm text-gray-400">This may take up to a minute.</p>
    </div>
  );
};