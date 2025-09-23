
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { uploadFile } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

interface FileUploadProps {
  onUploadSuccess: (contentId: number) => void;
  onError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [noteStyle, setNoteStyle] = useState<string>('default');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onError(''); // Clear previous errors
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      onError('Please select a file to upload.');
      return;
    }

    setLoading(true);
    onError('');

    try {
      const guestId = uuidv4();
      const data = await uploadFile(file, noteStyle, guestId);
      onUploadSuccess(data.content_id);
    } catch (err: any) {
      onError(err.response?.data?.detail || 'An error occurred during file upload.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <Form>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Upload your lecture file (.pdf, .pptx)</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>

        <Form.Group controlId="noteStyle" className="mb-3">
          <Form.Label>Note Style</Form.Label>
          <Form.Select value={noteStyle} onChange={(e) => setNoteStyle(e.target.value)}>
            <option value="default">Default</option>
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="visually-hidden">Loading...</span>
            </>
          ) : (
            'Generate Notes'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default FileUpload;
