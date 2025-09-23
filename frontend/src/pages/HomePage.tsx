
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
import FileUpload from '../components/FileUpload';
import NoteResult from '../components/NoteResult';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const HomePageContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
  max-width: 800px;
  margin: 0 auto;
`;

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
    <HomePageContainer>
      {!contentId ? (
        <>
          <h1 className="text-center mb-4">Get Your Lecture Notes Instantly</h1>
          <p className="text-center text-secondary mb-4">Upload a file and let our AI do the rest.</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <FileUpload onUploadSuccess={handleUploadSuccess} onError={handleError} />
        </>
      ) : (
        <NoteResult contentId={contentId} />
      )}
    </HomePageContainer>
  );
};

export default HomePage;
