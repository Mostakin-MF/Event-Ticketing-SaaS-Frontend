"use client";

import Link from "next/link";
import { Ticket, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white text-slate-900 font-sans">

      <main>
        {/* Mission Section */}
        <section className="py-24 px-6 mx-auto max-w-7xl text-center font-sans">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-8 leading-tight italic">
            Our Mission: Revolutionizing Events in <span className="text-primary">Bangladesh</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed italic mb-12">
            TicketBD was born out of a simple need: to make event organizing in Bangladesh seamless, secure, and professional.
            We are bridging the gap between local organizers and modern technology.
          </p>
          <div className="grid gap-12 md:grid-cols-3">
            <div className="p-8 rounded-2xl bg-slate-50 transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5">
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Community First</h3>
              <p className="text-slate-600 text-sm italic leading-relaxed">We empower local communities to host better, more organized events.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5">
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-6">
                <Target className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p className="text-slate-600 text-sm italic leading-relaxed">Honest pricing and reliable data for every organizer, big or small.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 transition-all hover:bg-white hover:shadow-xl hover:shadow-primary/5">
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mx-auto mb-6">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-slate-600 text-sm italic leading-relaxed">Constantly evolving to support new local payment and entry methods.</p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-slate-50 py-24 px-6 font-sans">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-8 italic text-slate-900 underline decoration-primary/20 underline-offset-8">The TicketBD Story</h2>
            <div className="prose prose-slate lg:prose-lg mx-auto text-slate-700 italic leading-loose">
              <p>
                From frantic ticket queues in Dhaka to the surge of digital payments across the country, we've seen it all.
                Our team of Bangladeshi engineers wanted to build something that speaks the language of local business.
                Whether it's the BST timezone requirement or the nuances of bKash transactions,
                TicketBD is built from the ground up for our unique market.
              </p>
              <p className="mt-8">
                Today, we support over <span className="text-slate-900 font-bold">500+</span> organizers and have scanned hundreds of thousands of tickets.
                But our journey is just beginning. We're here to make sure your next event is your best event.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
