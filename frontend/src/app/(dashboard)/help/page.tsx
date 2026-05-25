'use client';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth.store';
import {
  ChevronDown, ChevronUp,
  Search, FileText, Send, Bell, CheckCircle, XCircle, Clock,
  Users, Building2, ClipboardList, ShieldCheck, BookOpen,
  GraduationCap, MessageSquare, ArrowRight,
} from 'lucide-react';

/* ─── Accordion ─────────────────────────────────────────────────────────── */
function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-white border-t border-gray-100 text-sm text-gray-600 leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Step ───────────────────────────────────────────────────────────────── */
function Step({ n, title, description, icon }: { n: number; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-[#1a3a6b] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {n}
        </div>
        <div className="w-px flex-1 bg-gray-200 mt-2" />
      </div>
      <div className="pb-6 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-blue-500">{icon}</span>
          <p className="text-sm font-semibold text-gray-900">{title}</p>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

/* ─── Status badge ───────────────────────────────────────────────────────── */
function StatusBadge({ label, color, description }: { label: string; color: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${color}`}>{label}</span>
      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

/* ═══════════════════════ ROLE CONTENT ═══════════════════════════════════ */

function StudentHelp() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <div className="flex items-center gap-3 mb-3">
          <GraduationCap size={28} />
          <h2 className="text-xl font-bold">Welcome, Student</h2>
        </div>
        <p className="text-blue-200 text-sm max-w-xl">
          riftApply helps you find and apply to universities around the world. From searching programs to receiving your admission decision, this guide walks you through every step.
        </p>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4">How it works — step by step</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Step n={1} icon={<Search size={16} />} title="Search for Universities"
            description="Go to 'Search Schools' to browse universities and their available programs. Filter by module and program to find the best fit for your goals." />
          <Step n={2} icon={<FileText size={16} />} title="Prepare and Upload Documents"
            description="Each application requires supporting documents: passport/ID, transcripts, language certificate, statement of purpose, etc. Have these ready as PDF or image files (max 5 MB each)." />
          <Step n={3} icon={<Send size={16} />} title="Submit Your Application"
            description="Select a university and program, fill in your details, attach your documents, and submit. Your application goes to the riftApply admissions team for an initial review." />
          <Step n={4} icon={<Clock size={16} />} title="Wait for Admin Review"
            description="The admissions team reviews your documents to make sure everything is in order. This typically takes 1–3 business days. You will receive a notification if anything is missing." />
          <Step n={5} icon={<Building2 size={16} />} title="Application Sent to University"
            description="Once approved by the admissions team, your application is forwarded to the university. The university will review your profile and make a decision." />
          <Step n={6} icon={<Bell size={16} />} title="Receive the Decision"
            description="When the university responds, the admissions team will notify you via your Messages inbox. You will receive a clear notification with the outcome and any notes from the university." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">What your application status means</h3>
        <div className="space-y-2">
          <StatusBadge label="Pending Review" color="bg-yellow-100 text-yellow-700" description="Your application has been received and is waiting for the admissions team to review your documents." />
          <StatusBadge label="Approved" color="bg-blue-100 text-blue-700" description="Your documents have been verified and accepted. Your application is about to be forwarded to the university." />
          <StatusBadge label="Sent to Uni" color="bg-purple-100 text-purple-700" description="Your application has been forwarded to the university admissions office. They are reviewing your profile." />
          <StatusBadge label="Accepted" color="bg-green-100 text-green-700" description="The university has accepted your application. The admissions team will contact you with next steps." />
          <StatusBadge label="Refused" color="bg-red-100 text-red-600" description="The university was unable to offer you a place at this time. You can apply to other programs or universities." />
          <StatusBadge label="Rejected" color="bg-red-100 text-red-600" description="Your documents did not meet the admissions requirements. Check the reason in your Messages and contact support if needed." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Frequently asked questions</h3>
        <div className="space-y-2">
          <Accordion title="How long does the review process take?">
            <p>The initial document review by the riftApply team typically takes 1–3 business days. Once forwarded to the university, their response can take anywhere from 2 days to 2 weeks depending on the institution.</p>
          </Accordion>
          <Accordion title="Can I apply to more than one university?">
            <p>Yes, you can submit applications to multiple universities and programs. Each application is reviewed independently.</p>
          </Accordion>
          <Accordion title="What documents do I need?">
            <p>Standard requirements include: a valid passport or national ID, official academic transcripts, an English language certificate (IELTS / TOEFL), and a statement of purpose. Some programs may require a CV or letters of recommendation. Check each university's requirements before applying.</p>
          </Accordion>
          <Accordion title="Where can I see my submitted documents?">
            <p>Go to <strong>My Documents</strong> in the sidebar. All files you've uploaded with your applications are listed there, with links to open them.</p>
          </Accordion>
          <Accordion title="I was rejected — what do I do?">
            <p>Check your Messages inbox for the rejection reason. You can correct any missing or incorrect documents and submit a new application, or apply to a different university or program.</p>
          </Accordion>
          <Accordion title="How do I know when the university has responded?">
            <p>You'll receive a notification in your <strong>Messages</strong> inbox as soon as the admissions team has processed the university's response. The bell icon at the top of the page also shows your unread count.</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function AgentHelp() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <div className="flex items-center gap-3 mb-3">
          <Users size={28} />
          <h2 className="text-xl font-bold">Welcome, Agent</h2>
        </div>
        <p className="text-blue-200 text-sm max-w-xl">
          As an admissions agent, you submit and manage university applications on behalf of your students. This guide covers everything from account verification to tracking decisions.
        </p>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4">How it works — step by step</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Step n={1} icon={<ShieldCheck size={16} />} title="Get Your Account Verified"
            description="After registering, submit your company or individual documents under 'Verification Status'. An admin will review and approve your account before you can submit applications." />
          <Step n={2} icon={<Search size={16} />} title="Search for Universities"
            description="Use 'Search Schools' to browse the full catalog of universities and programs. Review admission requirements, available modules, and program details." />
          <Step n={3} icon={<FileText size={16} />} title="Submit an Application for a Student"
            description="Click 'New Application', select the university and program, enter the student's details, and upload their documents. Each application is linked to a specific student and program." />
          <Step n={4} icon={<Clock size={16} />} title="Admin Reviews the Documents"
            description="riftApply's admissions team verifies the submitted documents. If something is missing or incorrect, you'll be notified via Messages. Approved applications are then forwarded to the university." />
          <Step n={5} icon={<Building2 size={16} />} title="University Makes a Decision"
            description="The university reviews the application and responds to the admissions team with an accept, refuse, or info request decision." />
          <Step n={6} icon={<Bell size={16} />} title="You Receive the Outcome"
            description="The admissions team notifies you through your Messages inbox with the university's decision. You can then inform your student of the result." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Application status reference</h3>
        <div className="space-y-2">
          <StatusBadge label="Pending Review" color="bg-yellow-100 text-yellow-700" description="Submitted and waiting for the riftApply admissions team to review the documents." />
          <StatusBadge label="Approved" color="bg-blue-100 text-blue-700" description="Documents are verified. The application will be forwarded to the university shortly." />
          <StatusBadge label="Sent to Uni" color="bg-purple-100 text-purple-700" description="Forwarded to the university admissions office. Awaiting their decision." />
          <StatusBadge label="Accepted" color="bg-green-100 text-green-700" description="The university has accepted the student's application. Check Messages for details." />
          <StatusBadge label="Refused" color="bg-red-100 text-red-600" description="The university declined. You can submit a new application to a different program or university." />
          <StatusBadge label="Rejected" color="bg-red-100 text-red-600" description="The admissions team rejected the documents. Check the reason and resubmit with corrected files." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Frequently asked questions</h3>
        <div className="space-y-2">
          <Accordion title="Why can't I submit applications yet?">
            <p>Your account must be verified by an admin before you can submit applications. Go to <strong>Verification Status</strong> to upload your documents and check your approval status. You'll be notified once approved.</p>
          </Accordion>
          <Accordion title="Can I submit applications for multiple students?">
            <p>Yes. Each application you create is tied to a specific student (by name and contact details). You can manage all your submissions from the <strong>Applications</strong> page.</p>
          </Accordion>
          <Accordion title="How will I know if a document is rejected?">
            <p>You'll receive a notification in your <strong>Messages</strong> inbox explaining what was wrong. Review the reason and submit a corrected application.</p>
          </Accordion>
          <Accordion title="Can I apply to multiple universities for the same student?">
            <p>Yes. Submit a separate application for each university and program combination. Each is tracked independently.</p>
          </Accordion>
          <Accordion title="Where do I see university decisions?">
            <p>Once the admissions team processes the university's response, a notification is sent to your <strong>Messages</strong> inbox. The Applications page also shows the latest status for each submission.</p>
          </Accordion>
          <Accordion title="What if the university requests more information?">
            <p>You'll be notified in your Messages inbox. Contact the university or admissions team directly with the requested information.</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function UniversityHelp() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <div className="flex items-center gap-3 mb-3">
          <Building2 size={28} />
          <h2 className="text-xl font-bold">Welcome, University</h2>
        </div>
        <p className="text-blue-200 text-sm max-w-xl">
          riftApply connects you with qualified applicants from around the world. Applications are pre-screened by our admissions team before they reach you, so every application you see is complete and verified.
        </p>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4">How it works — step by step</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Step n={1} icon={<ShieldCheck size={16} />} title="Account Verification"
            description="After registering, your account is reviewed and approved by the riftApply team. Once active, you can set up your profile and programs." />
          <Step n={2} icon={<BookOpen size={16} />} title="Set Up Your Profile and Programs"
            description="Go to 'My Profile' to add your institution's modules and programs. Applicants can then find and apply to your specific offerings." />
          <Step n={3} icon={<ClipboardList size={16} />} title="Receive Applications"
            description="When a student or agent submits an application for your institution, the riftApply team reviews it first. Only complete and approved applications are forwarded to your Applications inbox." />
          <Step n={4} icon={<FileText size={16} />} title="Review Applicant Documents"
            description="In your Applications inbox, click any application to expand it and view all submitted documents. Review the applicant's details, transcripts, certificates, and other files." />
          <Step n={5} icon={<CheckCircle size={16} />} title="Make Your Decision"
            description="For each application, you can: Accept the applicant, Refuse with a reason, or Request more information. Add a message to accompany your decision — it's required for refusals and info requests." />
          <Step n={6} icon={<Bell size={16} />} title="riftApply Notifies the Candidate"
            description="After you respond, the admissions team processes your decision and notifies the student or agent. You don't need to contact the applicant directly." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Application status in your inbox</h3>
        <div className="space-y-2">
          <StatusBadge label="Awaiting Decision" color="bg-yellow-100 text-yellow-700" description="This application has been forwarded to you and is waiting for your response." />
          <StatusBadge label="Accepted" color="bg-green-100 text-green-700" description="You have accepted this applicant. The admissions team will notify them." />
          <StatusBadge label="Refused" color="bg-red-100 text-red-600" description="You have declined this application. The admissions team will notify the applicant." />
          <StatusBadge label="Info Requested" color="bg-orange-100 text-orange-700" description="You have requested additional information. The admissions team will follow up with the applicant." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Frequently asked questions</h3>
        <div className="space-y-2">
          <Accordion title="Do I need to contact applicants directly?">
            <p>No. The riftApply admissions team acts as the intermediary. After you submit your decision, they will communicate the outcome to the student or agent. You only interact through this platform.</p>
          </Accordion>
          <Accordion title="What documents will applicants submit?">
            <p>Typically: passport or national ID, academic transcripts, English language certificate (IELTS/TOEFL), and a statement of purpose. Additional documents may be included depending on the program.</p>
          </Accordion>
          <Accordion title="Can I accept an application without writing a message?">
            <p>Yes. A message is optional for acceptances. However, for refusals and info requests, a message explaining your decision is required before you can submit your response.</p>
          </Accordion>
          <Accordion title="How do I set up my programs?">
            <p>Go to <strong>My Profile</strong>. You can add modules (e.g., Engineering, Business) and programs within each module (e.g., Civil Engineering, MBA). Applicants filter and apply by these categories.</p>
          </Accordion>
          <Accordion title="What if I need more information from an applicant?">
            <p>Use the <strong>Request More Info</strong> option in the application detail panel. Write exactly what you need in the message field. The admissions team will relay your request to the applicant.</p>
          </Accordion>
          <Accordion title="Where do I see notifications for new applications?">
            <p>New applications are shown in your <strong>Applications</strong> inbox. You'll also receive a dashboard notification and email to your registered address each time a new application is forwarded to you.</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

function AdminHelp() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1a3a6b 0%, #1e4fa0 100%)' }}>
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck size={28} />
          <h2 className="text-xl font-bold">Admin Control Center</h2>
        </div>
        <p className="text-blue-200 text-sm max-w-xl">
          As an admin, you are the hub of the admissions process — verifying accounts, approving applications, forwarding them to universities, and notifying candidates of decisions.
        </p>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-4">Platform workflow overview</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <Step n={1} icon={<ShieldCheck size={16} />} title="Verify Agents and Universities"
            description="When an agent or university registers, their account starts as 'Pending'. Go to Agents or Universities to review their submitted documents and either approve or reject their account. Rejected accounts receive a reason in their dashboard." />
          <Step n={2} icon={<ClipboardList size={16} />} title="Review Incoming Applications"
            description="When a student or agent submits an application, it lands in the Applications queue with status 'Pending Review'. Open the Applications page to review each submission — check the attached documents before acting." />
          <Step n={3} icon={<CheckCircle size={16} />} title="Approve or Reject Applications"
            description="Approve the application if documents are complete and valid. Reject it if documents are missing or incorrect — always provide a clear reason so the applicant can resubmit. Rejected applicants are notified automatically." />
          <Step n={4} icon={<Send size={16} />} title="Send to University"
            description="Once approved, click 'Send to University' on the application. This forwards it to the university's Applications inbox and sends them a notification email and dashboard alert." />
          <Step n={5} icon={<Bell size={16} />} title="Monitor University Replies"
            description="When a university responds (accept, refuse, or info request), you receive a notification in your Emails inbox. The Dashboard also highlights applications awaiting your action under 'University Replies'." />
          <Step n={6} icon={<MessageSquare size={16} />} title="Notify the Candidate"
            description="After reviewing the university's decision, click 'Notify — Accepted' or 'Notify — Refused' on the application. This sends a formatted notification to the student or agent's inbox." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">All application statuses</h3>
        <div className="space-y-2">
          <StatusBadge label="Pending Review" color="bg-yellow-100 text-yellow-700" description="Just submitted. Awaiting your document review and approval or rejection." />
          <StatusBadge label="Approved" color="bg-blue-100 text-blue-700" description="Documents verified. Ready to be sent to the university — use the 'Send to University' button." />
          <StatusBadge label="Rejected" color="bg-red-100 text-red-600" description="You rejected the application. The applicant was notified with your reason." />
          <StatusBadge label="Sent to Uni" color="bg-purple-100 text-purple-700" description="Forwarded to the university. Awaiting their accept/refuse/info response." />
          <StatusBadge label="Accepted" color="bg-green-100 text-green-700" description="University accepted. Use 'Notify — Accepted' to inform the candidate." />
          <StatusBadge label="Refused by Uni" color="bg-red-100 text-red-600" description="University refused. Use 'Notify — Refused' to inform the candidate." />
          <StatusBadge label="Info Required" color="bg-orange-100 text-orange-700" description="University requested more information. Contact the applicant with the university's message." />
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3">Frequently asked questions</h3>
        <div className="space-y-2">
          <Accordion title="How do I approve or reject an agent's account?">
            <p>Go to <strong>Agents</strong> in the sidebar. Click on any pending agent to review their documents, then use the Approve or Reject buttons. For rejections, you must provide a reason — the agent will see it on their dashboard.</p>
          </Accordion>
          <Accordion title="What's the difference between rejecting an application vs. refusing by university?">
            <p><strong>Rejected (by admin)</strong>: You rejected it at the review stage — documents were incomplete or invalid. The applicant can resubmit after fixing the issue. <br /><strong>Refused by university</strong>: The university reviewed the full application and declined the candidate. You then notify the candidate of the university's decision.</p>
          </Accordion>
          <Accordion title="Do I need to write the notification message manually?">
            <p>No. When you click 'Notify — Accepted' or 'Notify — Refused', a pre-built template is used automatically based on the university's decision. The message is sent as a dashboard notification to the applicant.</p>
          </Accordion>
          <Accordion title="Where do I see university replies?">
            <p>The <strong>Dashboard</strong> shows a 'University Replies Awaiting Action' section with the most recent responses. The <strong>Applications</strong> page shows all applications including their current status. Your <strong>Emails</strong> inbox also receives a notification each time a university responds.</p>
          </Accordion>
          <Accordion title="What does the Statistics page show?">
            <p>The Stats page gives you a real-time overview of the entire platform: total students, agents, universities, application volumes, pending approvals, and university replies awaiting action. Use it to monitor platform health at a glance.</p>
          </Accordion>
          <Accordion title="Can I delete an agent or university?">
            <p>Yes. Go to <strong>Agents</strong> or <strong>Universities</strong> and use the Delete button on any account. This is permanent — proceed with caution.</p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════ PAGE ═══════════════════════════════════════════ */

export default function HelpPage() {
  const { role } = useAuthStore();

  const content = role === 'student'    ? <StudentHelp />
                : role === 'agent'      ? <AgentHelp />
                : role === 'university' ? <UniversityHelp />
                : role === 'admin'      ? <AdminHelp />
                : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Help Center</span>
        <ArrowRight size={13} />
        <span className="capitalize text-gray-600 font-medium">{role ?? 'Guide'}</span>
      </div>

      {content ?? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-400">
          <p className="text-sm">Help content unavailable. Please log in to see role-specific guidance.</p>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 flex items-start gap-3">
        <MessageSquare size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Still need help?</p>
          <p className="text-xs text-gray-500 mt-0.5">Contact the riftApply support team at <span className="text-blue-600 font-medium">support@riftapply.com</span> and we'll get back to you within one business day.</p>
        </div>
      </div>
    </div>
  );
}
