
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../services/api';
import { FaList, FaCompressArrowsAlt, FaExpandArrowsAlt } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onUploadSuccess: (contentId: number) => void;
  onError: (error: string) => void;
  guestId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onError, guestId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [noteStyle, setNoteStyle] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);

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
    if (!noteStyle) {
        onError('Please select a Note Style.');
        return;
    }

    setLoading(true);
    onError('');

    try {
      const data = await uploadFile(file, noteStyle, guestId);
      onUploadSuccess(data.content_id);
    } catch (err: any) {
      onError(err.response?.data?.detail || 'An error occurred during file upload.');
    } finally {
      setLoading(false);
    }
  };

  const noteStyleOptions: { name: string; value: string; icon: IconType, explanation: string }[] = [
    { name: 'Standard', value: 'standard', icon: FaList, explanation: 'A balanced overview of the key topics.' },
    { name: 'Concise', value: 'concise', icon: FaCompressArrowsAlt, explanation: 'A brief summary of the most important points.' },
    { name: 'Detailed', value: 'detailed', icon: FaExpandArrowsAlt, explanation: 'A comprehensive and in-depth exploration of the material.' },
  ];

  return (
    <div className="space-y-6">
        <div {...getRootProps()}>
            <motion.div
                className={`relative p-12 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-electric-blue' : 'border-gray-300 dark:border-gray-700'}`}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                whileHover={{ boxShadow: "0px 0px 8px rgb(0,123,255)" }}
            >
                <input {...getInputProps()} />
                <p className="text-lg">{isDragActive ? 'Drop the file here ...' : "Drag and drop file, or click to select"}</p>
                {file && <p className="mt-4 text-gray-500">Selected file: {file.name}</p>}
            </motion.div>
        </div>
        <div className="h-8">
            <AnimatePresence>
            {(isHovering || isDragActive) && (
                <motion.div
                className="text-center text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                >
                Note that only .pdf and .pptx formats are supported
                </motion.div>
            )}
            </AnimatePresence>
        </div>

      <div>
        <label className="block text-lg font-medium mb-2 text-center">Note Style</label>
        <div className="flex items-center justify-center gap-4">
          {noteStyleOptions.map((option) => {
            const IconComponent = option.icon as React.ComponentType;
            return (
              <motion.button
                key={option.value}
                onClick={() => setNoteStyle(option.value)}
                className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${noteStyle === option.value ? 'bg-electric-blue text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,123,255)" }}
              >
                <IconComponent />
                {option.name}
              </motion.button>
            );
          })}
        </div>
        <AnimatePresence>
            {noteStyle && (
                <motion.p 
                    className="text-center mt-2 text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {noteStyleOptions.find(o => o.value === noteStyle)?.explanation}
                </motion.p>
            )}
        </AnimatePresence>
      </div>

      <motion.button
        onClick={handleUpload}
        disabled={loading}
        className="w-full py-3 px-4 bg-electric-blue text-white font-bold rounded-lg disabled:bg-gray-400 transition-colors"
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(0,123,255)" }}
      >
        {loading ? 'Generating...' : 'Generate Notes for free'}
      </motion.button>
    </div>
  );
};

export default FileUpload;
