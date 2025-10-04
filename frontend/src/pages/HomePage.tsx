
import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import NoteResult from '../components/NoteResult';
import HowItWorks from '../components/HowItWorks';
import FeatureShowcase from '../components/FeatureShowcase';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [contentId, setContentId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guestId, setGuestId] = useState<string>('');

  useEffect(() => {
    let currentGuestId = sessionStorage.getItem('guestId');
    if (!currentGuestId) {
      currentGuestId = uuidv4();
      sessionStorage.setItem('guestId', currentGuestId);
    }
    setGuestId(currentGuestId);
  }, []);

  const handleUploadSuccess = (id: number) => {
    setContentId(id);
    setError(null);
  };

  const handleError = (err: string) => {
    setError(err);
    setContentId(null);
  };

  return (
    <div>
      <section className="pt-16 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Get Your Lecture Notes Instantly</h1>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">Built for students. Upload your lecture slides and receive useful notes in your choice of style.</p>
        </div>
        <div className="w-full max-w-2xl mt-8">
            {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}
            {contentId ? (
              <>
                <NoteResult contentId={contentId} />
                <motion.div 
                  className="mt-12 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xl">
                    <Link to="/login" className="text-electric-blue hover:underline">Create an account</Link> for free to generate more notes.
                  </p>
                </motion.div>
              </>
            ) : (
                <FileUpload onUploadSuccess={handleUploadSuccess} onError={handleError} guestId={guestId} />
            )}
        </div>
      </section>

      <HowItWorks />
      <FeatureShowcase />
      <Testimonials />
      <Faq />
    </div>
  );
};

export default HomePage;
