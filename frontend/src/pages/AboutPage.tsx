
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-8">About MyNotes</h2>
      <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300">
        <p>
          MyNotes is a tool designed to help students learn more effectively. Simply upload your lecture slides or other course materials, and our AI-powered service will generate comprehensive and well-structured notes for you.
        </p>
        <h4 className="text-2xl font-bold">How it Works</h4>
        <p>
          Our application accepts PDF and PowerPoint files. Once you upload a file, our system processes the content and uses a generative AI model to create notes in your desired style. You can choose from default, concise, or detailed notes to fit your study needs.
        </p>
        <h4 className="text-2xl font-bold">Why it's Useful</h4>
        <p>
          By automating the note-taking process, MyNotes allows you to focus more on understanding the lecture content rather than transcribing it. The generated notes can be a great resource for revision and exam preparation.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
