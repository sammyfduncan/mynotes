import React, { useState, useEffect, useMemo } from 'react';
import { getUserNotes, deleteNote, renameNote } from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, Edit, NotebookText, FileText, Calendar, Palette } from 'lucide-react';
import SkeletonCard from '../components/SkeletonCard';

const DashboardPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState(location.state?.message || null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getUserNotes();
        setNotes(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      } catch (err: any) {
        setError(err.response?.data?.detail || 'An error occurred while fetching notes.');
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading for demonstration
    setTimeout(fetchNotes, 1000);

    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        navigate(location.pathname, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }

  }, [successMessage, location.pathname, navigate]);

  const handleDelete = async (noteId: number) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
        setNotes(notes.filter(note => note.id !== noteId));
      } catch (err) {
        setError('Failed to delete note.');
      }
    }
  };

  const handleRename = async (noteId: number, currentFilename: string) => {
    const newFilename = window.prompt('Enter new filename:', currentFilename);
    if (newFilename && newFilename !== currentFilename) {
      try {
        const updatedNote = await renameNote(noteId, newFilename);
        setNotes(notes.map(note => note.id === noteId ? updatedNote : note));
      } catch (err) {
        setError('Failed to rename note.');
      }
    }
  };

  const filteredNotes = useMemo(() => 
    notes.filter(note => 
      note.filename.toLowerCase().includes(searchQuery.toLowerCase())
    ), [notes, searchQuery]);

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />)}
    </div>
  );

  if (error) {
    return <div className="bg-red-500 text-white p-4 rounded-lg max-w-6xl mx-auto">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold">Your Notes</h2>
        <div className="relative">
          <input 
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>
      {loading ? renderSkeletons() : (
        notes.length === 0 ? (
          <div className="text-center p-20 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center">
              <NotebookText size={64} className="text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold">No Notes Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">It looks like you haven't forged any notes. Let's create your first one!</p>
              <Link to="/create" className="mt-4 inline-block py-2 px-5 bg-electric-blue text-white font-bold rounded-lg hover:scale-105 transition-transform">
                  Create a Note
              </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNotes.map((note) => (
              <motion.div 
                key={note.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden group relative"
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                      <FileText className="text-electric-blue mr-3" size={20}/>
                      <h3 className="text-xl font-bold truncate" title={note.filename}>{note.filename}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <Calendar className="mr-2" size={16}/>
                      <span>{new Date(note.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Palette className="mr-2" size={16}/>
                      <span className="capitalize">{note.style} Style</span>
                  </div>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button onClick={() => handleRename(note.id, note.filename)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
                <Link to={`/notes/${note.id}`} className="block mt-4 p-4 bg-gray-100 dark:bg-gray-700 text-center font-bold text-electric-blue hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  View Note
                </Link>
              </motion.div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default DashboardPage;
