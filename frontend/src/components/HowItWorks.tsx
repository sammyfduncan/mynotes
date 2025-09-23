import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UploadCloud, Cpu, DownloadCloud } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.section
      ref={ref}
      className="py-24"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-12 text-center">
        <div className="flex flex-col items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <UploadCloud className="w-16 h-16 text-electric-blue mb-4" />
          <h3 className="text-3xl font-bold mb-2">1. Upload</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">Upload your lecture slides or notes in PDF or PPTX format.</p>
        </div>
        <div className="flex flex-col items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Cpu className="w-16 h-16 text-electric-blue mb-4" />
          <h3 className="text-3xl font-bold mb-2">2. Generate</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">Our AI will process the content and generate notes for you.</p>
        </div>
        <div className="flex flex-col items-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <DownloadCloud className="w-16 h-16 text-electric-blue mb-4" />
          <h3 className="text-3xl font-bold mb-2">3. Download</h3>
          <p className="text-lg text-gray-600 dark:text-gray-400">Download your generated notes in Markdown format.</p>
        </div>
      </div>
    </motion.section>
  );
};

export default HowItWorks;