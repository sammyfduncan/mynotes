import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Files, SlidersHorizontal, BrainCircuit } from 'lucide-react';

const features = [
  {
    icon: <Files size={32} className="text-electric-blue" />,
    title: 'Multiple File Types',
    description: 'Upload your lecture slides in either .pdf or .pptx format. We handle the rest.',
  },
  {
    icon: <SlidersHorizontal size={32} className="text-electric-blue" />,
    title: 'Tailor Your Notes',
    description: 'Choose from Standard, Concise, or Detailed note styles to fit your study needs.',
  },
  {
    icon: <BrainCircuit size={32} className="text-electric-blue" />,
    title: 'AI-Powered Summaries',
    description: 'Leverages cutting-edge generative AI to create insightful and accurate notes.',
  },
];

const FeatureShowcase: React.FC = () => {
  const cardVariants: Variants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Powerful Features, Simple Interface</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Everything you need to transform lectures into knowledge.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col items-center text-center"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
