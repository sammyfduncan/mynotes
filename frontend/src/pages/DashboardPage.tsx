import React, { useState, useEffect } from 'react';
import { getUserNotes } from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getUserNotes();
        setNotes(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred while fetching notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        // Clean the location state
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }

  }, [successMessage, location.pathname, navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {successMessage && (
          <motion.div
            className="bg-green-500 text-white p-4 rounded-lg mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>
      <h2 className="text-4xl font-bold mb-8">Your Notes</h2>
      {notes.length === 0 ? (
        <div className="text-center p-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-xl">You haven't created any notes yet.</p>
          <Link to="/create" className="mt-4 inline-block py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">
            Generate one now
          </Link>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="p-4">File Name</th>
                <th className="p-4">Note Style</th>
                <th className="p-4">Date Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
                  <td className="p-4">{note.filename}</td>
                  <td className="p-4">{note.style}</td>
                  <td className="p-4">{new Date(note.created_at).toLocaleDateString()}</td>
                  <td className="p-4">
                    <Link to={`/notes/${note.id}`} className="py-2 px-4 bg-electric-blue text-white font-bold rounded-lg">
                      View/Download
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
