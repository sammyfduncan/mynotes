
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteResult, downloadNote, updateNoteContent } from '../services/api';
import ReactMarkdown from 'react-markdown';

const NotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const guestId = sessionStorage.getItem('guestId') || '';

  useEffect(() => {
    const fetchNote = async () => {
      try {
        if (id) {
          const data = await getNoteResult(parseInt(id), guestId);
          setNote(data);
          setEditedContent(data.notes);
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, guestId]);

  const handleDownload = async () => {
    try {
      if (id) {
        const blob = await downloadNote(parseInt(id), guestId);
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

  const handleSave = async () => {
    if (!id) return;
    try {
      const updatedNote = await updateNoteContent(parseInt(id), editedContent);
      setNote(updatedNote);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save changes.');
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
            <h2 className="text-3xl font-bold mb-4">{note?.filename}</h2>
            <div className="prose dark:prose-invert max-w-none">
                {isEditing ? (
                    <textarea 
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full h-96 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
                    />
                ) : (
                    <ReactMarkdown>{note?.notes}</ReactMarkdown>
                )}
            </div>
            <div className="mt-6 flex items-center space-x-4">
                <button onClick={handleDownload} className="py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">
                    Download Note
                </button>
                {isEditing ? (
                    <button onClick={handleSave} className="py-2 px-4 bg-green-500 text-white font-bold rounded-lg">
                        Save
                    </button>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="py-2 px-4 bg-gray-500 text-white font-bold rounded-lg">
                        Edit
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default NotePage;
