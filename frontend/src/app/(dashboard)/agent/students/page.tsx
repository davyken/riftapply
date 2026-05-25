'use client';
import { Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/PageLoader';

export default function AgentStudentsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Students</h1>
        <p className="text-sm text-gray-500 mt-0.5">Students associated with your agent account.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <EmptyState
          icon={<Users size={36} />}
          title="No students yet"
          description="Students who register through your referral link or are assigned to your account will appear here."
        />
      </div>
    </div>
  );
}
