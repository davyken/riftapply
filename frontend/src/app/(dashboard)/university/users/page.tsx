'use client';
import { Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/PageLoader';

export default function UniversityUsersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage who has access to your university portal.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <EmptyState
          icon={<Users size={36} />}
          title="Team management coming soon"
          description="The ability to invite and manage team members will be available in a future update."
        />
      </div>
    </div>
  );
}
