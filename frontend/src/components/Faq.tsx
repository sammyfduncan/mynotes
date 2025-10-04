import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: 'Is my data secure?',
    answer: 'Yes, security is a top priority. When you register for an account, your password is encrypted and your notes are tied to your account, ensuring only you can access them. Guests can also use the app, but their access is limited.',
  },
  {
    question: 'What file formats are supported?',
    answer: 'Currently, NoteForger supports the most common formats for lecture slides: .pdf and .pptx.',
  },
  {
    question: 'How many notes can I create as a guest?',
    answer: 'To prevent abuse of the service, guests are limited to generating one set of notes per session. To create unlimited notes and save them to your account, please sign up for a free account.',
  },
  {
    question: 'What are the different note styles?',
    answer: 'NoteForger offers three distinct styles: "Standard" provides a balanced overview, "Concise" gives you a brief summary of key points, and "Detailed" creates a comprehensive and in-depth exploration of the material.',
  },
];

const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <motion.header
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{question}</h3>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={24} />
        </motion.div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-600 dark:text-gray-400">{answer}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

const Faq: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Have questions? We have answers.
          </p>
        </div>
        <div>
          {faqData.map((faq, index) => (
            <AccordionItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
