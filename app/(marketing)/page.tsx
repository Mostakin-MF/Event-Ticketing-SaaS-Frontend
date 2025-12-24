"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Ticket,
  ShieldCheck,
  Zap,
  Smartphone,
  BarChart3,
  Users,
  Globe,
  ArrowRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900">

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-8 text-center lg:text-left">
                <div className="inline-flex self-center lg:self-start items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                  </span>
                  Ready for Bangladesh Standard Time (BST)
                </div>

                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  Empowering <span className="text-primary italic">Bangladesh's</span> Event Organizers
                </h1>

                <p className="max-w-xl text-lg leading-relaxed text-slate-600 self-center lg:self-start">
                  The most advanced, multi-tenant ticketing SaaS built for local needs.
                  Accept bKash, Nagad, and Rocket payments with ease.
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                  <Link href="/admin" className="btn btn-primary btn-lg rounded-full px-8 shadow-xl shadow-primary/30 group">
                    Start Selling Now
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button className="btn btn-outline btn-lg rounded-full px-8 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-primary">
                    View Demo
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 lg:justify-start">
                  <div className="flex -space-x-3 overflow-hidden">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-10 w-10 rounded-full border-2 border-white bg-slate-200">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                          alt="User avatar"
                          className="h-full w-full rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-medium text-slate-600">
                    Trusted by <span className="text-slate-900 font-bold">500+</span> Event Organizers in BD
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-primary/30 to-secondary/30 blur-2xl"></div>
                <div className="relative rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
                  <img
                    src="/hero_organizer_dashboard_preview_1766508040458.png"
                    alt="TicketBD Dashboard Preview"
                    className="rounded-xl w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-base font-bold uppercase tracking-wider text-primary">Simple Process</h2>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                How TicketBD Works
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              <StepCard
                number="01"
                title="Create Your Tenant"
                description="Register your organization and customize your branded ticket store in minutes."
              />
              <StepCard
                number="02"
                title="Configure Events"
                description="Set up event details, ticket tiers (VIP, GA), and BDT pricing with local payment options."
              />
              <StepCard
                number="03"
                title="Sell & Scan"
                description="Launch your event, accept mobile payments, and use our staff app for seamless QR check-ins."
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-16 text-center">
              <h2 className="text-base font-bold uppercase tracking-wider text-primary">Platform Features</h2>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Everything you need to sell out.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Smartphone className="text-primary" size={24} />}
                title="Mobile First Checkout"
                description="Optimized ticketing experience for Dhaka's mobile users. Lightning fast and secure."
              />
              <FeatureCard
                icon={<ShieldCheck className="text-secondary" size={24} />}
                title="Secure Payments"
                description="Built-in integration for bKash, Nagad, Rocket and international cards via SSLCommerz/Stripe."
              />
              <FeatureCard
                icon={<Zap className="text-primary" size={24} />}
                title="Instant QR Generation"
                description="Tickets are generated instantly with secure, signed QR codes for fast venue entry."
              />
              <FeatureCard
                icon={<BarChart3 className="text-secondary" size={24} />}
                title="Advanced Analytics"
                description="Track sales, attendee demographics, and scan-in rates in real-time from your dashboard."
              />
              <FeatureCard
                icon={<Users className="text-primary" size={24} />}
                title="Multi-Tenant Isolation"
                description="Each organizer gets a private, branded space with their own custom domain support."
              />
              <FeatureCard
                icon={<Globe className="text-secondary" size={24} />}
                title="Localized Support"
                description="Proudly made in Bangladesh, for Bangladesh. 24/7 support in Bengali and English."
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-accent py-20 text-white">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="grid gap-12 sm:grid-cols-3">
              <div>
                <div className="text-5xl font-extrabold text-secondary">৳50M+</div>
                <div className="mt-2 text-slate-300 font-medium italic">Processed in Sales</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold text-white">200K+</div>
                <div className="mt-2 text-slate-300 font-medium italic">Tickets Scanned</div>
              </div>
              <div>
                <div className="text-5xl font-extrabold text-secondary">500+</div>
                <div className="mt-2 text-slate-300 font-medium italic">Active Organizers</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-2xl sm:px-16">
              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Ready to host your next big event?
                </h2>
                <p className="mt-6 text-lg text-emerald-100 italic">
                  Join the leading event management platform in Bangladesh. Set up your first event in less than 5 minutes.
                </p>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                  <Link href="/admin" className="btn bg-white text-primary border-none hover:bg-slate-50 btn-lg rounded-full px-12 font-bold shadow-xl">
                    Get Started for Free
                  </Link>
                </div>
              </div>
              {/* Abstract Background Shapes */}
              <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-emerald-400 opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-secondary opacity-30 blur-3xl"></div>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-slate-50 p-8 transition-all hover:border-primary/20 hover:bg-white hover:shadow-xl hover:shadow-primary/10">
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200 group-hover:bg-primary/5 transition-colors">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed italic">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-5xl font-black text-slate-100 absolute top-4 right-6">{number}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{title}</h3>
      <p className="text-slate-600 italic relative z-10">{description}</p>
    </div>
  );
}
