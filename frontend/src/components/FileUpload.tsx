import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { Form, Button, Spinner } from 'react-bootstrap';
import { uploadFile } from '../services/api';
import { v4 as uuidv4 } from 'uuid';

const DropzoneContainer = styled.div`
  border: 2px dashed var(--secondary-text);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--accent-color);
  }
`;

interface FileUploadProps {
  onUploadSuccess: (contentId: number) => void;
  onError: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [noteStyle, setNoteStyle] = useState<string>('default');
  const [loading, setLoading] = useState<boolean>(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      onError('');
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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
      <DropzoneContainer {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
        {file && <p>Selected file: {file.name}</p>}
      </DropzoneContainer>

      <Form.Group controlId="noteStyle" className="my-3">
        <Form.Label>Note Style</Form.Label>
        <Form.Select value={noteStyle} onChange={(e) => setNoteStyle(e.target.value)}>
          <option value="default">Default</option>
          <option value="concise">Concise</option>
          <option value="detailed">Detailed</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" onClick={handleUpload} disabled={loading} className="w-100">
        {loading ? <Spinner animation="border" size="sm" /> : 'Generate Notes'}
      </Button>
    </div>
  );
};

export default FileUpload;