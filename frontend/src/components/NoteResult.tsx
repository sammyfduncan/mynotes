import React, { useState, useEffect } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { getNoteResult, downloadNote } from '../services/api';
import ReactMarkdown from 'react-markdown';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const NoteContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
  background-color: var(--secondary-bg);
  border-radius: 10px;
  padding: 2rem;
  margin-top: 2rem;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem;
`;

interface NoteResultProps {
  contentId: number;
}

const NoteResult: React.FC<NoteResultProps> = ({ contentId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const data = await getNoteResult(contentId);
        if (data.status === 'complete') {
          setNote(data);
          setLoading(false);
          clearInterval(poll);
        }
      } catch (err: any) {
        if (err.response?.status !== 202) {
          setError(err.response?.data?.detail || 'An error occurred.');
          setLoading(false);
          clearInterval(poll);
        }
      }
    }, 3000);

    return () => clearInterval(poll);
  }, [contentId]);

  const handleDownload = async () => {
    try {
      const blob = await downloadNote(contentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `note_${contentId}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      setError('Failed to download note.');
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Processing your notes...</p>
      </LoadingContainer>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <NoteContainer>
      <h2>Your Notes</h2>
      <ReactMarkdown>{note.notes}</ReactMarkdown>
      <Button variant="primary" onClick={handleDownload} className="mt-3">
        Download Note
      </Button>
    </NoteContainer>
  );
};

export default NoteResult;