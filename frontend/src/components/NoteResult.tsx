
import React, { useState, useEffect } from 'react';
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
      <div className="text-center p-12">
        <p className="text-lg">Processing your notes...</p>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h2 className="text-3xl font-bold mb-4">Your Notes</h2>
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown>{note.notes}</ReactMarkdown>
      </div>
      <button onClick={handleDownload} className="mt-6 py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">
        Download Note
      </button>
    </div>
  );
};

export default NoteResult;
