import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <p>
          This Privacy Policy describes how NoteForger ("we," "us," or "our") collects, uses, and discloses your information when you use our website (the "Service").
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect several types of information for various purposes to provide and improve our Service to you.
        </p>
        <h3 className="text-xl font-bold mt-4 mb-2">a. Personal Data</h3>
        <p>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul>
          <li>Email address</li>
          <li>Password (stored in a hashed format)</li>
        </ul>
        <h3 className="text-xl font-bold mt-4 mb-2">b. Usage Data & Uploaded Content</h3>
        <p>
          We collect information that your browser sends whenever you visit our Service or when you access the Service by or through a mobile device ("Usage Data"). We also temporarily store the files (.pdf, .pptx) you upload to generate notes. These files are processed by our backend and may be shared with third-party generative AI services to provide the core functionality of the app.
        </p>
        <h3 className="text-xl font-bold mt-4 mb-2">c. Guest Data</h3>
        <p>
          For guest users, we assign a unique session identifier to manage note generation limits. This is stored in your browser's session storage and is not linked to any personal information.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">2. Use of Data</h2>
        <p>
          NoteForger uses the collected data for various purposes:
        </p>
        <ul>
          <li>To provide and maintain our Service</li>
          <li>To manage your account and provide you with customer support</li>
          <li>To process your uploaded documents and generate notes</li>
          <li>To monitor the usage of our Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>

        <h2 className="text-2xl font-bold mt-8 mb-4">3. Data Storage and Security</h2>
        <p>
          The security of your data is important to us. We store your uploaded files and generated notes on our server. We take reasonable measures to protect your personal information and content, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">4. Third-Party Services</h2>
        <p>
          We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. Specifically, we use Google AI Studio (Gemini) to generate notes from your content.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">5. Your Rights</h2>
        <p>
          You have the right to access, update or to delete the information we have on you. You can do this at any time through your account settings page. Deleting your account will permanently remove your personal data and all associated notes.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">6. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us.
        </p>


      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
