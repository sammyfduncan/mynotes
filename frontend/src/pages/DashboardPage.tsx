import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { getUserNotes } from '../services/api';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h2>Your Notes</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>File Name</th>
            <th>Note Style</th>
            <th>Date Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td>{note.filename}</td>
              <td>{note.style}</td>
              <td>{new Date(note.created_at).toLocaleDateString()}</td>
              <td>
                <Link to={`/notes/${note.id}`} className="btn btn-primary">
                  View/Download
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DashboardPage;