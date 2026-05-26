import React from 'react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using the riftApply platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. User Responsibilities</h2>
          <p className="mb-4">You are responsible for maintaining the accuracy of the information you provide and for keeping your account credentials secure. Any fraudulent activity or submission of false documents may result in account termination.</p>
          
          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Service Modifications</h2>
          <p className="mb-4">We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.</p>

          <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Limitation of Liability</h2>
          <p className="mb-4">riftApply shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.</p>
        </div>
      </div>
    </div>
  );
}
