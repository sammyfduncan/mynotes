
import React, { useState, useEffect } from 'react';
import { Alert, Button, Spinner } from 'react-bootstrap';
import { getNoteResult, downloadNote } from '../services/api';
import ReactMarkdown from 'react-markdown';

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
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Processing your notes...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="mt-4">
      <h2>Your Notes</h2>
      <div className="p-3 border rounded">
        <ReactMarkdown>{note.notes}</ReactMarkdown>
      </div>
      <Button variant="primary" onClick={handleDownload} className="mt-3">
        Download Note
      </Button>
    </div>
  );
};

export default NoteResult;
