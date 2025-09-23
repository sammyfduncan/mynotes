
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
    <div>
      <section className="pt-16 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Get Your Lecture Notes Instantly</h1>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">Built for students. Upload your lecture slides and receive useful notes in your choice of style.</p>
        </div>
        <div className="w-full max-w-2xl mt-8">
            {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}
            {contentId ? (
                <NoteResult contentId={contentId} />
            ) : (
                <FileUpload onUploadSuccess={handleUploadSuccess} onError={handleError} />
            )}
        </div>
      </section>

      <HowItWorks />
    </div>
  );
};

export default HomePage;
