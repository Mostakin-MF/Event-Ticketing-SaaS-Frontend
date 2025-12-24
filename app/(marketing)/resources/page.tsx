"use client";

import Link from "next/link";
import { Ticket, BookOpen, FileText, PlayCircle, HelpCircle } from "lucide-react";

export default function ResourcesPage() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">

      <main className="py-24 px-6 mx-auto max-w-7xl font-sans">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 leading-tight italic">
            Helpful <span className="text-primary">Resources</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto italic">
            Guides, documentation, and tools to help you succeed as an event organizer in Bangladesh.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <ResourceItem
            icon={<BookOpen className="text-primary" size={24} />}
            title="SaaS User Guide"
            description="Deep dive into all features of the TicketBD platform. From setup to reporting."
          />
          <ResourceItem
            icon={<FileText className="text-secondary" size={24} />}
            title="Event Marketing Kit"
            description="Free templates and advice for promoting your event on social media."
          />
          <ResourceItem
            icon={<PlayCircle className="text-primary" size={24} />}
            title="Video Tutorials"
            description="Short videos showing you how to scan tickets and manage orders."
          />
          <ResourceItem
            icon={<HelpCircle className="text-secondary" size={24} />}
            title="FAQ & Support"
            description="Answers to common questions about payments, local taxes, and BST settings."
          />
        </div>

        <div className="mt-20 p-12 rounded-3xl bg-primary text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6 italic">Need Direct Help?</h2>
            <p className="text-emerald-50 mb-8 italic">Our support team is available from 9 AM to 9 PM BST daily.</p>
            <button className="btn bg-white text-primary border-none hover:bg-slate-50 rounded-full px-12 font-bold shadow-xl transition-transform hover:scale-105 active:scale-95">
              Contact Support
            </button>
          </div>
          {/* Abstract background shapes */}
          <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-emerald-400 opacity-20 blur-2xl"></div>
          <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-emerald-700 opacity-30 blur-2xl"></div>
        </div>
      </main>
    </div>
  );
}

function ResourceItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all flex gap-6 items-start group">
      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 transition-colors ring-1 ring-slate-100">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors underline decoration-primary/10 group-hover:decoration-primary/40 underline-offset-4">{title}</h3>
        <p className="text-slate-600 text-sm italic leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
