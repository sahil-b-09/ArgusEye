"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/ui/hero-odyssey";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { Check, ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const ArgusEyePlayer = dynamic(() => import("@/components/video/ArgusEyePlayer"), { ssr: false });
const HTFArgusEyePlayer = dynamic(() => import("@/components/video/HTFArgusEyePlayer"), { ssr: false });

export default function Home() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(0);

  const handleSubscribe = (plan: string, amount: number) => {
    setSelectedPlan(plan);
    setSelectedAmount(amount);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-white font-sans selection:bg-[#00FF66]/30">

      {/* Dynamic Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0C0A09]/70 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="ArgusEye Logo" width={32} height={32} className="object-contain" />
            <span className="text-xl font-bold tracking-widest text-white">ARGUSEYE</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
            <a href="#indicators" className="hover:text-white transition-colors">Indicators</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <a href="#pricing" className="hidden md:flex px-5 py-2 text-sm font-semibold bg-white/10 text-white border border-white/10 rounded-full hover:bg-white/20 transition-all duration-300">
              Get Access
            </a>
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-[#0C0A09]/95 backdrop-blur-lg border-b border-white/10 flex flex-col p-6 gap-4 text-center">
            <a href="#indicators" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-white/5 rounded-lg">Indicators</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:bg-white/5 rounded-lg">Pricing</a>
          </div>
        )}
      </nav>

      {/* Hero Section using WebGL Component */}
      <HeroSection />

      {/* Reined Indicators Section */}
      <section id="indicators" className="py-32 bg-[#0C0A09] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">The Toolkit</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Two focused indicators. Built to remove noise and highlight what matters on your charts.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col h-full p-10 md:p-12 rounded-3xl bg-[#111111] border border-white/5 hover:border-[#00FF66]/30 hover:shadow-[0_0_30px_rgba(0,255,102,0.05)] transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00FF66]/5 rounded-full blur-[80px] group-hover:bg-[#00FF66]/10 transition-colors" />
              <h3 className="text-3xl font-bold mb-4 group-hover:text-[#00FF66] transition-colors">Argus Eye 24/7</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 relative z-10">
                A robust ATR-based range filtering system providing clear trade entries. Removes market noise and tracks momentum with precision to identify high-probability setups.
              </p>
              <ul className="space-y-3 relative z-10 mb-8">
                <li className="flex items-start gap-3 text-gray-300"><Check className="w-5 h-5 text-[#00FF66] shrink-0 mt-0.5" /> <span>Automated SL, TP1, TP2 & TP3 targets</span></li>
                <li className="flex items-start gap-3 text-gray-300"><Check className="w-5 h-5 text-[#00FF66] shrink-0 mt-0.5" /> <span>Dynamic trailing stop-loss with unlimited TP projections</span></li>
                <li className="flex items-start gap-3 text-gray-300"><Check className="w-5 h-5 text-[#00FF66] shrink-0 mt-0.5" /> <span>Live on-chart dashboard displaying current trade state</span></li>
              </ul>

              <div className="relative mt-auto pt-8">
                <div className="absolute inset-0 top-8 -m-1 bg-gradient-to-r from-[#00FF66] to-[#00FFAA] rounded-2xl blur opacity-20" />
                <div className="relative bg-[#090909] rounded-xl overflow-hidden ring-1 ring-white/10">
                  <div className="px-4 py-3 bg-[#111111] border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-[#00FF66]" /> Argus Eye 24/7
                    </span>
                  </div>
                  <ArgusEyePlayer />
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="flex flex-col h-full p-10 md:p-12 rounded-3xl bg-[#111111] border border-white/5 hover:border-[#00FF66]/30 hover:shadow-[0_0_30px_rgba(0,255,102,0.05)] transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#00FFAA]/5 rounded-full blur-[80px] group-hover:bg-[#00FFAA]/10 transition-colors" />
              <h3 className="text-3xl font-bold mb-4 group-hover:text-[#00FFAA] transition-colors">HTF Argus Eye</h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 relative z-10">
                The ultimate macro perspective toolkit. It overlays High Timeframe (HTF) PO3 candles directly onto your lower timeframe charts so you never lose the narrative.
              </p>
              <ul className="space-y-3 relative z-10">
                <li className="flex items-start gap-3 text-gray-300"><Check className="w-5 h-5 text-[#00FFAA] shrink-0 mt-0.5" /> <span>Real-time simultaneous High Timeframe tracking</span></li>
                <li className="flex items-start gap-3 text-gray-300"><Check className="w-5 h-5 text-[#00FFAA] shrink-0 mt-0.5" /> <span>Side-by-side macro candles updating dynamically with LTF actions</span></li>
                <li className="flex items-start gap-3 text-gray-300"><Check className="w-5 h-5 text-[#00FFAA] shrink-0 mt-0.5" /> <span>On-chart dashboard calculating precise HTF candle closure times</span></li>
              </ul>

              <div className="relative mt-auto pt-8">
                <div className="absolute inset-0 top-8 -m-1 bg-gradient-to-r from-[#00FFAA] to-[#00FF66] rounded-2xl blur opacity-20" />
                <div className="relative bg-[#090909] rounded-xl overflow-hidden ring-1 ring-white/10">
                  <div className="px-4 py-3 bg-[#111111] border-b border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-[#00FFAA]" /> HTF Argus Eye
                    </span>
                  </div>
                  <HTFArgusEyePlayer />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-[#090909] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pricing</h2>
            {/* Functional Billing Toggle */}
            <div
              className="inline-flex bg-[#111111] border border-white/10 rounded-full p-1 relative items-center justify-center cursor-pointer"
              onClick={() => setIsYearly(!isYearly)}
            >
              <div className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isYearly ? "bg-white/5 text-[#00FF66] border border-[#00FF66]/20" : "text-gray-400 border border-transparent"}`}>Monthly</div>
              <div className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isYearly ? "bg-white/5 text-[#00FF66] border border-[#00FF66]/20" : "text-gray-400 border border-transparent"}`}>Yearly <span className="text-xs text-[#00FF66] bg-[#00FF66]/10 px-2 py-0.5 rounded-full ml-1">-20%</span></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* 24/7 Pricing */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-[#00FF66]/30 hover:shadow-[0_0_30px_rgba(0,255,102,0.05)] transition-all duration-300 flex flex-col h-full group">
              <h3 className="text-xl font-medium mb-2 group-hover:text-[#00FF66] transition-colors">Argus Eye 24/7</h3>
              <div className="text-4xl font-bold mb-6">
                ₹{isYearly ? "57,600" : "6,000"} <span className="text-base font-normal text-gray-500">/ {isYearly ? "year" : "month"}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-400"><Check className="w-4 h-4 mt-0.5 text-[#00FF66]" /> Full access to Argus Eye 24/7</li>
                <li className="flex items-start gap-3 text-sm text-gray-400"><Check className="w-4 h-4 mt-0.5 text-[#00FF66]" /> Regular script updates included</li>
              </ul>
              <button
                onClick={() => handleSubscribe('Argus Eye 24/7', isYearly ? 50000 : 5000)}
                className="w-full py-4 rounded-xl bg-white/5 group-hover:bg-[#00FF66]/10 border border-white/10 group-hover:border-[#00FF66]/30 group-hover:text-[#00FF66] transition-all duration-300 font-medium tracking-wide mb-3"
              >
                Subscribe 24/7
              </button>
              <p className="text-center text-xs text-gray-500">Access granted within 12 hours</p>
            </div>

            {/* Bundle / Combined Pricing */}
            <div className="p-10 rounded-3xl bg-[#141414] border border-[#00FF66]/30 relative shadow-[0_0_30px_rgba(0,255,102,0.1)] flex flex-col h-full transform lg:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#00FF66] text-black text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                Most Popular
              </div>
              <h3 className="text-xl font-medium mb-2">The Complete Bundle</h3>
              <div className="text-5xl font-bold mb-6 text-[#00FF66]">
                ₹{isYearly ? "72,000" : "7,500"} <span className="text-base font-normal text-gray-500">/ {isYearly ? "year" : "month"}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-300"><Check className="w-4 h-4 mt-0.5 text-[#00FF66]" /> Argus Eye 24/7 Included</li>
                <li className="flex items-start gap-3 text-sm text-gray-300"><Check className="w-4 h-4 mt-0.5 text-[#00FFAA]" /> HTF Argus Eye Included</li>
                <li className="flex items-start gap-3 text-sm text-gray-300"><Check className="w-4 h-4 mt-0.5 text-white" /> Access to private community</li>
              </ul>
              <button
                onClick={() => handleSubscribe('Argus Eye Bundle', isYearly ? 65000 : 6500)}
                className="w-full py-4 rounded-xl bg-[#00FF66] text-black hover:bg-[#00CC52] transition-colors font-bold tracking-wide shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_25px_rgba(0,255,102,0.5)] mb-3"
              >
                Subscribe to Bundle
              </button>
              <p className="text-center text-xs text-gray-400">Access granted within 12 hours</p>
            </div>

            {/* HTF Pricing */}
            <div className="p-8 rounded-3xl bg-[#111111] border border-white/5 hover:border-[#00FFAA]/30 hover:shadow-[0_0_30px_rgba(0,255,170,0.05)] transition-all duration-300 flex flex-col h-full group">
              <h3 className="text-xl font-medium mb-2 group-hover:text-[#00FFAA] transition-colors">HTF Argus Eye</h3>
              <div className="text-4xl font-bold mb-6">
                ₹{isYearly ? "28,800" : "3,000"} <span className="text-base font-normal text-gray-500">/ {isYearly ? "year" : "month"}</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-start gap-3 text-sm text-gray-400"><Check className="w-4 h-4 mt-0.5 text-[#00FFAA]" /> Full access to HTF Argus Eye</li>
                <li className="flex items-start gap-3 text-sm text-gray-400"><Check className="w-4 h-4 mt-0.5 text-[#00FFAA]" /> Regular script updates included</li>
              </ul>
              <button
                onClick={() => handleSubscribe('HTF Argus Eye', isYearly ? 28800 : 3000)}
                className="w-full py-4 rounded-xl bg-white/5 group-hover:bg-[#00FFAA]/10 border border-white/10 group-hover:border-[#00FFAA]/30 group-hover:text-[#00FFAA] transition-all duration-300 font-medium tracking-wide mb-3"
              >
                Subscribe HTF
              </button>
              <p className="text-center text-xs text-gray-500">Access granted within 12 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-20 pb-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="ArgusEye Logo" width={32} height={32} className="object-contain" />
                <span className="text-2xl font-bold tracking-widest text-white">ARGUSEYE</span>
              </div>
              <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                Empowering traders with clarity through advanced charting indicators. Designed for TradingView.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-white">Products</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Argus Eye 24/7</a></li>
                <li><a href="#" className="hover:text-white transition-colors">HTF Argus Eye</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Bundle</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-white">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="mailto:support@arguseye247.com" className="hover:text-white transition-colors">support@arguseye247.com</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 text-center md:flex md:justify-between md:text-left text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} ArgusEye. All rights reserved.</p>
            <p className="mt-4 md:mt-0">Not financial advice. Trading involves risk.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
