import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { getNoteResult, downloadNote } from '../services/api';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

const NotePageContainer = styled.div`
  background-color: var(--secondary-bg);
  border-radius: 10px;
  padding: 2rem;
  margin-top: 2rem;
`;

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<any>(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (id) {
          const data = await getNoteResult(parseInt(id));
          setNote(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDownload = async () => {
    try {
      if (id) {
        const blob = await downloadNote(parseInt(id));
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `note_${id}.md`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      setError('Failed to download note.');
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <NotePageContainer>
      <h2>{note.filename}</h2>
      <ReactMarkdown>{note.notes}</ReactMarkdown>
      <Button variant="primary" onClick={handleDownload} className="mt-3">
        Download Note
      </Button>
    </NotePageContainer>
  );
};

export default NotePage;