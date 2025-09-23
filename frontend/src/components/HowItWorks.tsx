
import React from 'react';
import UploadIcon from './icons/UploadIcon';
import GenerateIcon from './icons/GenerateIcon';
import DownloadIcon from './icons/DownloadIcon';

const HowItWorks: React.FC = () => {
  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <UploadIcon />
          <h3 className="text-2xl font-bold mb-2">1. Upload</h3>
          <p className="text-gray-600 dark:text-gray-400">Upload your lecture slides or notes in PDF or PPTX format.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <GenerateIcon />
          <h3 className="text-2xl font-bold mb-2">2. Generate</h3>
          <p className="text-gray-600 dark:text-gray-400">Our AI will process the content and generate notes for you.</p>
        </div>
        <div className="flex flex-col items-center p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <DownloadIcon />
          <h3 className="text-2xl font-bold mb-2">3. Download</h3>
          <p className="text-gray-600 dark:text-gray-400">Download your generated notes in Markdown format.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
