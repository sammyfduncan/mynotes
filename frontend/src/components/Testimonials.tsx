import React from 'react';
import { motion, Variants } from 'framer-motion';
import { User } from 'lucide-react';

const testimonials = [
  {
    quote: 'NoteForger has been a lifesaver for my exam prep. I can process a whole semester\'s worth of lectures in minutes. Truly a game-changer!',
    name: 'Alex R.',
    role: 'Computer Science Student',
  },
  {
    quote: 'The different note styles are fantastic. I use the concise style for quick reviews and the detailed one for deep dives. Incredibly versatile.',
    name: 'Jessica M.',
    role: 'Medical Student',
  },
  {
    quote: 'As a visual learner, being able to quickly get notes from presentation slides has made studying so much more efficient. I can focus on the concepts, not just transcription.',
    name: 'David L.',
    role: 'Business Administration Student',
  },
];

const Testimonials: React.FC = () => {
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
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">What Students Are Saying</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
            Real feedback from students who have transformed their study habits.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-electric-blue flex items-center justify-center mr-4">
                  <User className="text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
