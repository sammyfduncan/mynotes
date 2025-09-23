import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import NoteResult from '../components/NoteResult';
import HowItWorks from '../components/HowItWorks';

const HomePage: React.FC = () => {
  const [contentId, setContentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUploadSuccess = (id: number) => {
    setContentId(id);
    setError(null);
  };

  const handleError = (err: string) => {
    setError(err);
    setContentId(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Get Your Lecture Notes Instantly</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Upload a file and let our AI do the rest.</p>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-4">Try it out now:</h2>
        {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}
        {contentId ? (
          <NoteResult contentId={contentId} />
        ) : (
          <FileUpload onUploadSuccess={handleUploadSuccess} onError={handleError} />
        )}
      </div>

      <HowItWorks />
    </div>
  );
};

export default HomePage;