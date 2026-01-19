"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Ticket,
  BarChart3,
  Globe,
  ArrowRight,
  Check,
  CreditCard,
  QrCode,
  Layout,
  Sparkles,
  Users,
  Mic2
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 selection:bg-emerald-500/30 selection:text-emerald-800 min-h-screen">

      {/* GLOBAL GRAIN TEXTURE */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply z-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <main className="relative overflow-hidden">

        {/* FESTIVAL HERO */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 px-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px] opacity-60 mix-blend-multiply -z-10"></div>

          <div className="mx-auto max-w-[1400px]">
            <div className="flex flex-col items-center text-center">

              {/* HYPE PILL */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-white/50 px-4 py-1.5 mb-8 backdrop-blur-md transition-transform hover:scale-105 shadow-sm">
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-600">Tickets LIVE</span>
                <div className="h-3 w-[1px] bg-emerald-500/30"></div>
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                  Use code <span className="text-emerald-950">LAUNCH26</span>
                </span>
              </div>

              {/* MASSIVE HEADLINE */}
              <h1 className="max-w-4xl text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.95] uppercase drop-shadow-sm">
                The Operating System <br /> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-600 animate-gradient-x">Mega Events</span>
              </h1>

              <p className="max-w-2xl text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10">
                Join 20,000+ organizers powering the next generation of festivals, concerts, and conferences.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center mb-20">
                <Link href="/admin" className="group h-12 px-8 rounded-full bg-emerald-600 text-white font-black text-sm uppercase tracking-wide inline-flex items-center justify-center gap-2 transition-all hover:bg-emerald-500 hover:scale-[1.02] shadow-lg shadow-emerald-500/20">
                  Start Selling
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/pricing" className="h-12 px-8 rounded-full border-2 border-slate-200 bg-white text-slate-900 font-bold text-sm uppercase tracking-wide inline-flex items-center justify-center gap-2 transition-all hover:bg-slate-50 hover:border-slate-300">
                  See Pricing
                </Link>
              </div>

              {/* FEATURE SPLIT - BULLET POINTS & DASHBOARD */}
              <div className="mt-20 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center text-left">

                {/* LEFT: SUPPORTING POINTS */}
                <div className="flex flex-col gap-8 order-2 lg:order-1">
                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-wide">
                      Total Control <br /> <span className="text-emerald-600">Over Your Event</span>
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      Manage everything from ticket tiers to gate entry in one unified dashboard.
                    </p>
                  </div>

                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="mt-1 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-emerald-200">
                        <BarChart3 size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Real-time Analytics</h4>
                        <p className="text-sm text-slate-600 mt-1">Track sales, revenue, and visits as they happen.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 border border-cyan-200">
                        <Ticket size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Instant Ticket Gen</h4>
                        <p className="text-sm text-slate-600 mt-1">Generate unique QR codes for every attendee instantly.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="mt-1 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-200">
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Fraud Prevention</h4>
                        <p className="text-sm text-slate-600 mt-1">Bank-grade security prevents duplicate or fake tickets.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* RIGHT: SMALLER DASHBOARD */}
                <div className="relative perspective-[2000px] group order-1 lg:order-2 flex justify-center lg:justify-end">
                  {/* Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-emerald-500/20 blur-[100px] opacity-40 -z-10 rounded-full animate-pulse-slow"></div>

                  <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden transform transition-all duration-700 ease-out rotate-y-[-12deg] rotate-x-[5deg] group-hover:rotate-y-[-5deg] group-hover:rotate-x-0 ring-1 ring-slate-900/5 animate-float">
                    {/* Chrome Header */}
                    <div className="h-8 w-full bg-slate-50 border-b border-slate-200 flex items-center px-4 gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400"></div>
                      <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                      <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                    </div>

                    <img
                      src="/hero_organizer_dashboard_preview_1766508040458.png"
                      alt="TicketBD Dashboard"
                      className="w-full h-auto opacity-100 block"
                    />
                    {/* Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none opacity-50"></div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        <section className="py-8 border-y border-slate-200 bg-white overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap items-center">
            <span className="text-xl font-black text-slate-500 uppercase tracking-widest">Global Partners</span>
            <SponsorLogo name="TechFest" />
            <SponsorLogo name="SummerVibe" />
            <SponsorLogo name="CorpSummit" />
            <SponsorLogo name="DhakaComicon" />
            <SponsorLogo name="MusicWave" />
            <SponsorLogo name="StartupGrind" />
            <SponsorLogo name="FoodieFest" />
            {/* Repeat for seamless loop */}
            <span className="text-xl font-black text-slate-500 uppercase tracking-widest">Global Partners</span>
            <SponsorLogo name="TechFest" />
            <SponsorLogo name="SummerVibe" />
            <SponsorLogo name="CorpSummit" />
            <SponsorLogo name="DhakaComicon" />
          </div>
        </section>


        {/* STATS - BIG & BOLD */}
        <section className="py-20 px-6 bg-white">
          <div className="mx-auto max-w-[1400px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
              <StatBig value="50M+" label="Ticket Revenue" />
              <StatBig value="200K" label="Attendees" />
              <StatBig value="1.2K" label="Events Live" />
              <StatBig value="0.0s" label="Downtime" />
            </div>
          </div>
        </section>


        {/* FEATURES - VIP PASS STAGED CARDS */}
        <section className="py-20 px-6 relative bg-slate-50">
          <div className="mx-auto max-w-[1400px]">
            <div className="mb-16 text-center">
              <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-3">The Lineup</h2>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase leading-tight">
                Everything Included <br /> <span className="text-slate-400">In Your Pass</span>
              </h3>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeaturePass
                title="Instant Configure"
                desc="Launch your event page in seconds. No coding required."
                icon={<Zap size={32} className="text-amber-600" />}
                color="bg-amber-100"
              />
              <FeaturePass
                title="Mobile Entry"
                desc="Scan tickets with our lightning fast organizer app."
                icon={<QrCode size={32} className="text-emerald-600" />}
                color="bg-emerald-100"
              />
              <FeaturePass
                title="Local Payments"
                desc="bKash, Nagad, Rocket baked right into checkout."
                icon={<CreditCard size={32} className="text-cyan-600" />}
                color="bg-cyan-100"
              />
              <FeaturePass
                title="CRM & Data"
                desc="Own your audience. Export data or sync with tools."
                icon={<Users size={32} className="text-pink-600" />}
                color="bg-pink-100"
              />
              <FeaturePass
                title="Custom Brand"
                desc="White-label solution to keep your brand front and center."
                icon={<Layout size={32} className="text-purple-600" />}
                color="bg-purple-100"
              />
              <FeaturePass
                title="Support 24/7"
                desc="We're awake when your event is happening."
                icon={<Mic2 size={32} className="text-slate-700" />}
                color="bg-white"
              />
            </div>
          </div>
        </section>

        {/* CTA - MASSIVE GRADIENT */}
        <section className="py-16 px-6">
          <div className="mx-auto max-w-[1400px]">
            <div className="relative rounded-[2.5rem] bg-gradient-to-r from-emerald-500 to-teal-500 p-10 md:p-14 text-center text-white overflow-hidden shadow-2xl shadow-emerald-500/30">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-5 text-white">
                  Ready to Scale?
                </h2>
                <p className="text-lg md:text-xl font-bold mb-8 opacity-90 text-emerald-50 max-w-2xl mx-auto">
                  Join the fastest growing event platform in Bangladesh today.
                </p>
                <Link href="/admin" className="h-12 px-8 rounded-full bg-white text-emerald-900 font-black text-sm uppercase tracking-wide inline-flex items-center justify-center gap-2 transition-transform hover:scale-105 hover:bg-slate-50">
                  Get Your Account
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

function StatBig({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col border-l-4 border-emerald-500 pl-6">
      <span className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-2">{value}</span>
      <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function FeaturePass({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className="group relative bg-white border border-slate-200 hover:border-emerald-500/50 rounded-3xl p-8 transition-all hover:-translate-y-2 shadow-sm hover:shadow-xl">
      <div className={`mb-6 h-12 w-12 rounded-xl ${color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 uppercase mb-3 tracking-wide group-hover:text-emerald-600 transition-colors">{title}</h3>
      <p className="text-slate-600 text-base leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  )
}

function SponsorLogo({ name }: { name: string }) {
  return (
    <div className="px-6 text-xl font-bold text-slate-400 uppercase tracking-tighter hover:text-slate-600 transition-colors cursor-default">
      {name}
    </div>
  )
}
