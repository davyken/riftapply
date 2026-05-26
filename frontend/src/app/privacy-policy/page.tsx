import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Information We Collect</h2>
          <p className="mb-4">We collect information that you provide directly to us when using riftApply, including your name, email address, and any academic or personal details required for university applications.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. How We Use Your Information</h2>
          <p className="mb-4">Your information is used solely for the purpose of facilitating the university admission process. We share your data with universities you apply to, and we do not sell your personal data to third parties.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Data Security</h2>
          <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at support@riftapply.com.</p>
        </div>
      </div>
    </div>
  );
}
