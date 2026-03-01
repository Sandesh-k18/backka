"use client"

import React from 'react'
import Link from 'next/link'
import { Heart, Github, ShieldCheck } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-16 mt-auto relative overflow-hidden">
      {/* Subtle Background Glow to prevent it from looking "flat" */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[-20%] left-[10%] w-[300px] h-[300px] bg-indigo-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Brand & Mission */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black tracking-tighter text-white">
                back<span className="text-indigo-500">KA</span>
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">AI Shield Active</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              A secure bridge for honest intelligence. Built with privacy-first architecture and powered by Hugging Face open-source models.
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/sandesh-k18" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Platform</h4>
              <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-300">
                <Link href="/about" className="hover:text-indigo-400 transition-colors">Our Mission</Link>
                <Link href="/faq" className="hover:text-indigo-400 transition-colors">Help Center</Link>
                <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</Link>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Legal</h4>
              <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-300">
                <Link href="/privacy-policy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
                <div className="flex items-center gap-2 text-emerald-500/80 pt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-tighter">GDPR Ready</span>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} backKA. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
            Developed with 
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> 
            by <span className="text-slate-200 uppercase">Sandesh Kharel</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer