"use client";

import Link from "next/link";
import { Ticket, CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans">

      <main className="py-24 px-6 mx-auto max-w-7xl">
        <div className="text-center mb-16 font-sans">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 text-slate-900 italic">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto italic">
            No hidden fees. Only pay when you sell tickets. Grow your event business with TicketBD.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 font-sans">
          <PricingCard
            title="Starter"
            price="0"
            description="Perfect for small local events and meetups."
            features={[
              "Up to 500 tickets/month",
              "Standard bKash/Nagad integration",
              "Basic Staff App access",
              "Email support"
            ]}
          />
          <PricingCard
            isPopular
            title="Professional"
            price="4,999"
            description="Built for growing organizers and concerts."
            features={[
              "Unlimited tickets",
              "Custom branding",
              "Advanced analytics",
              "Multi-tenant support",
              "Priority support in Bengali"
            ]}
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            description="For stadium-scale events and large festivals."
            features={[
              "Dedicated account manager",
              "Custom domain support",
              "Offline scanning hardware",
              "White-labeled mobile app",
              "24/7 on-site support"
            ]}
          />
        </div>
      </main>
    </div>
  );
}

function PricingCard({ title, price, description, features, isPopular }: { title: string, price: string, description: string, features: string[], isPopular?: boolean }) {
  return (
    <div className={`relative p-8 rounded-3xl bg-white border ${isPopular ? 'border-primary ring-4 ring-primary/10 shadow-2xl' : 'border-slate-100 shadow-xl'} flex flex-col`}>
      {isPopular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">Most Popular</div>}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-sm font-bold text-slate-500">৳</span>
        <span className="text-4xl font-black">{price}</span>
        {price !== "Custom" && <span className="text-slate-500 font-medium">/mo</span>}
      </div>
      <p className="text-slate-600 mb-8 italic text-sm leading-relaxed">{description}</p>
      <div className="space-y-4 mb-10 flex-grow">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-primary mt-0.5 shrink-0" />
            <span className="text-sm font-medium text-slate-700 italic">{f}</span>
          </div>
        ))}
      </div>
      <button className={`btn w-full rounded-full font-bold ${isPopular ? 'btn-primary' : 'btn-outline border-slate-200 hover:bg-slate-50 hover:text-primary hover:border-primary'}`}>
        Choose {title}
      </button>
    </div>
  );
}
