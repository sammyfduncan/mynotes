import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import NoteResult from '../components/NoteResult';

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
      {!contentId ? (
        <>
          <h1 className="text-center mb-4">Get Your Lecture Notes Instantly</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <FileUpload onUploadSuccess={handleUploadSuccess} onError={handleError} />
        </>
      ) : (
        <NoteResult contentId={contentId} />
      )}
    </div>
  );
};

export default HomePage;