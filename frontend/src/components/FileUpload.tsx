import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-electric-blue' : 'border-gray-300 dark:border-gray-700'}`}>
        <input {...getInputProps()} />
        <p className="text-lg">{isDragActive ? 'Drop the files here ...' : "Drag 'n' drop some files here, or click to select files"}</p>
        {file && <p className="mt-4 text-gray-500">Selected file: {file.name}</p>}
      </div>

      <div>
        <label htmlFor="noteStyle" className="block text-lg font-medium mb-2">Note Style</label>
        <select
          id="noteStyle"
          value={noteStyle}
          onChange={(e) => setNoteStyle(e.target.value)}
          className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-electric-blue focus:border-transparent"
        >
          <option value="default">Default</option>
          <option value="concise">Concise</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-3 px-4 bg-electric-blue text-white font-bold rounded-lg disabled:bg-gray-400 transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Notes'}
      </button>
    </div>
  );
};

export default FileUpload;