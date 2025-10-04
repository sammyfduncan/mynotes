import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 mt-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-xl">NoteForger</p>
            <p>&copy; {new Date().getFullYear()} NoteForger. All rights reserved.</p>
          </div>
          <div className="flex space-x-6">
            <Link to="/contact" className="hover:text-gray-900 dark:hover:text-white">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
