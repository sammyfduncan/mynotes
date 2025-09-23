
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteResult, downloadNote } from '../services/api';
import ReactMarkdown from 'react-markdown';

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
    return <p>Loading...</p>;
  }

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
        <div className="p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">{note.filename}</h2>
            <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{note.notes}</ReactMarkdown>
            </div>
            <button onClick={handleDownload} className="mt-6 py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">
                Download Note
            </button>
        </div>
    </div>
  );
};

export default NotePage;
