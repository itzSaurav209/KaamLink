// File: client/src/pages/Landing.jsx
// Purpose: Marketing landing page highlighting KaamLink value proposition and flows

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Shield, Star, Users, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { label: 'Maid', icon: '🧹', value: 'maid' },
  { label: 'Plumber', icon: '🔧', value: 'plumber' },
  { label: 'Electrician', icon: '⚡', value: 'electrician' },
  { label: 'Driver', icon: '🚗', value: 'driver' },
  { label: 'Cook', icon: '🍳', value: 'cook' },
  { label: 'Carpenter', icon: '🪚', value: 'carpenter' },
  { label: 'House Help', icon: '🏠', value: 'house_help' },
  { label: 'Other', icon: '🛠️', value: 'other' },
];

const Landing = () => {
  const navigate = useNavigate();

  const handleSosDemo = () => {
    toast('SOS alert triggered (demo). Our support team and your emergency contact would be notified.', {
      icon: '🚨',
    });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Find Trusted Local Workers Near You
            </h1>
            <p className="text-base sm:text-lg text-indigo-100 mb-6">
              From plumbers to maids — hire verified professionals in minutes, not days.
            </p>
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => navigate('/search')}
                className="btn-primary bg-white text-primary hover:bg-gray-100"
              >
                I Need a Worker
              </button>
              <Link
                to="/register/worker"
                className="inline-flex items-center justify-center px-4 py-2 border border-white/70 text-white font-semibold rounded-xl hover:bg-white/10 hover:scale-[1.02]"
              >
                I&apos;m a Worker
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-indigo-100">
              <div className="flex items-center gap-1">
                <CheckCircle2 size={16} />
                <span>No middlemen</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield size={16} />
                <span>Verified profiles</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={16} />
                <span>Ratings &amp; reviews</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="card p-6 bg-white/95 text-gray-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-2xl">
                  👷
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Diverse local workforce</p>
                  <p className="text-xs text-gray-500">
                    Maids · Plumbers · Electricians · Drivers · Cooks · Carpenters
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <div>
                    <p className="font-semibold">5k+</p>
                    <p className="text-gray-500">Workers onboarded</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-2">
                  <Star size={16} className="text-amber-400" />
                  <div>
                    <p className="font-semibold">4.8</p>
                    <p className="text-gray-500">Avg worker rating</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" />
                  <div>
                    <p className="font-semibold">100%</p>
                    <p className="text-gray-500">Secure payments</p>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-500" />
                  <div>
                    <p className="font-semibold">SOS</p>
                    <p className="text-gray-500">Women safety support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => navigate(`/search?category=${cat.value}`)}
              className="card p-4 flex flex-col items-center justify-center text-center hover:-translate-y-0.5"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold text-gray-900">{cat.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How It Works</h2>
        <p className="text-gray-600 mb-6">
          Post your requirement, compare verified workers, and hire with confidence.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'Post Your Requirement',
              desc: 'Share what kind of help you need, your location, and budget in a few steps.',
            },
            {
              title: 'Browse Verified Workers',
              desc: 'View worker profiles, skills, verification badges, and ratings in your locality.',
            },
            {
              title: 'Hire & Pay Safely',
              desc: 'Confirm your booking and pay digitally through KaamLink’s secure layer.',
            },
          ].map((step, idx) => (
            <div
              key={step.title}
              className="card p-4 relative"
            >
              <span className="absolute -top-3 left-4 h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & safety */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trust &amp; Safety</h2>
        <p className="text-gray-600 mb-6">
          Every worker on KaamLink goes through verification and continuous review.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <Shield className="text-primary" size={20} />,
              title: 'Verified Profiles',
              desc: 'Admins validate worker documents and approve only genuine profiles.',
            },
            {
              icon: <Star className="text-amber-400" size={20} />,
              title: 'Ratings & Reviews',
              desc: 'Employers leave transparent feedback after every completed job.',
            },
            {
              icon: <CheckCircle2 className="text-emerald-500" size={20} />,
              title: 'Safe Payments',
              desc: 'Track every transaction on KaamLink for better clarity and control.',
            },
          ].map((item) => (
            <div key={item.title} className="card p-4 flex gap-3">
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Women safety banner */}
      <section className="bg-gradient-to-r from-rose-500/90 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Worker Safety is Our Priority</h2>
            <p className="text-sm text-rose-50 max-w-xl">
              Every female worker profile is badge-verified and can activate an SOS alert during
              any job. Our team is always on standby.
            </p>
          </div>
          <button
            onClick={handleSosDemo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-rose-600 font-semibold rounded-xl hover:bg-rose-50"
          >
            <span>Demo SOS Alert</span>
          </button>
        </div>
      </section>

      {/* Testimonials (simplified) */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stories from our community</h2>
        <p className="text-gray-600 mb-6">
          Hear from workers and employers who trust KaamLink every day.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              name: 'Sunita, Maid',
              city: 'Mumbai',
              quote:
                'Through KaamLink I found regular households to work with. The reviews helped me build trust quickly.',
            },
            {
              name: 'Rahul, Employer',
              city: 'Bangalore',
              quote:
                'Finding an electrician on short notice was impossible earlier. Now I can see ratings and hire in minutes.',
            },
            {
              name: 'Farida, Cook',
              city: 'Delhi',
              quote:
                'I feel safer knowing my profile is verified and there is an SOS option if I ever feel unsafe.',
            },
          ].map((t) => (
            <div key={t.name} className="card p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.city}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  <Star size={14} />
                  <span>4.9</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">“{t.quote}”</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="card bg-gray-900 text-white px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Ready to find your next trusted worker?
            </h2>
            <p className="text-sm text-gray-300">
              Start by posting your requirement or browsing workers near you for free.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary bg-white text-gray-900 hover:bg-gray-100"
          >
            Get Started Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;

