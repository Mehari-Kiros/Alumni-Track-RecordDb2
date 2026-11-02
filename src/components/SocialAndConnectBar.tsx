/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { recordAndGetVisitorStats, VisitorStats } from '../utils/visitorTracker';
import { 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  Users, 
  Eye, 
  Radio, 
  Copy, 
  Check, 
  Send,
  HelpCircle,
  X
} from 'lucide-react';

interface SocialAndConnectBarProps {
  variant?: 'banner' | 'card' | 'compact' | 'footer';
  className?: string;
}

export const OFFICIAL_CHANNELS = {
  email: {
    address: 'alumni.affairs@edu.et',
    mailto: 'mailto:alumni.affairs@edu.et?subject=EDU-ATRD%20Inquiry%20-%20Ethiopian%20Defence%20University&body=Dear%20Registrar%20%26%20Alumni%20Affairs%20Directorate,%0D%0A%0D%0AMy%20Full%20Name:%20%0D%0AAlumni%20ID%20(if%20any):%20%0D%0AGraduation%20Year:%20%0D%0ACollege:%20%0D%0A%0D%0AMessage:%20%0D%0A',
    label: 'Email Directorate'
  },
  googleChat: {
    url: 'https://chat.google.com',
    label: 'Google Chat Online Services',
    account: 'alumni-services@edu.et'
  },
  telegram: {
    url: 'https://t.me/EthiopianDefenceUniversity',
    handle: '@EthiopianDefenceUniversity',
    label: 'Telegram Official Channel'
  },
  linkedin: {
    url: 'https://www.linkedin.com/school/ethiopian-defence-university/',
    handle: 'Ethiopian Defence University',
    label: 'LinkedIn Institutional Page'
  },
  twitter: {
    url: 'https://x.com/EthiopianDefUni',
    handle: '@EthiopianDefUni',
    label: 'Twitter / X Official'
  },
  facebook: {
    url: 'https://www.facebook.com/Ethiopiandefenceuniversity/',
    handle: 'Ethiopian Defence University',
    label: 'Facebook Official Page'
  },
  tiktok: {
    url: 'https://www.tiktok.com/@ethiopiandefenceuniversity',
    handle: '@ethiopiandefenceuniversity',
    label: 'TikTok Official Channel'
  }
};

export const SocialAndConnectBar: React.FC<SocialAndConnectBarProps> = ({
  variant = 'card',
  className = ''
}) => {
  const [stats, setStats] = useState<VisitorStats>(() => recordAndGetVisitorStats());
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);

  useEffect(() => {
    // Refresh live active count jitter every 45s
    const interval = setInterval(() => {
      setStats(recordAndGetVisitorStats());
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(OFFICIAL_CHANNELS.email.address);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // SVGs for branded social logos
  const GoogleChatIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.1 21.9l5.033-1.205C8.548 21.464 10.222 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-4 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm4 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
    </svg>
  );

  const TelegramIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );

  const LinkedInIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.53 1.53 0 0 0 1.54-1.53c0-.85-.69-1.54-1.54-1.54-.85 0-1.53.69-1.53 1.54 0 .84.68 1.53 1.53 1.53m1.4 9.74v-8.37H5.06v8.37h2.8z" />
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );

  const TikTokIcon = () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );

  // Split total into visual digits for digital odometer display
  const digits = stats.totalVisits.toString().padStart(6, '0').split('');

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
        {/* Visitors badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0F284E] border border-amber-500/30 text-amber-300 font-mono">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>{stats.totalVisits.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400">Visits</span>
        </div>

        {/* Live active indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{stats.activeNow} Active</span>
        </div>

        {/* Real mailto */}
        <a
          href={OFFICIAL_CHANNELS.email.mailto}
          title="Send Email to Alumni Affairs Directorate"
          className="flex items-center gap-1 px-2 py-1 rounded bg-[#0F284E] hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
        >
          <Mail className="w-3 h-3 text-amber-400" />
          <span>alumni.affairs@edu.et</span>
        </a>

        {/* Google Chat */}
        <button
          onClick={() => setShowChatModal(true)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
        >
          <GoogleChatIcon />
          <span>Google Chat</span>
        </button>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`space-y-6 text-white pb-6 border-b border-slate-850 ${className}`}>
        {/* 3-Column Footer Hub */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Col 1: Online Services (Real Mailto & Google Chat) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Online Services & Inquiries</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Official channels of the Registrar & Alumni Affairs Directorate for verification, tracer studies, and requests:
            </p>
            <div className="space-y-2">
              {/* Real Mailto */}
              <div className="flex items-center gap-1.5">
                <a
                  href={OFFICIAL_CHANNELS.email.mailto}
                  className="flex-1 flex items-center justify-between p-2.5 rounded-xl bg-[#0F284E] hover:bg-[#15386b] border border-blue-500/40 text-xs transition group"
                  title="Click to compose official email"
                >
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-white group-hover:text-amber-300">alumni.affairs@edu.et</span>
                  </div>
                  <span className="text-[10px] text-blue-300 font-medium">Mailto &rarr;</span>
                </a>
                <button
                  onClick={handleCopyEmail}
                  title="Copy email address"
                  className="p-2.5 rounded-xl bg-[#0F284E] hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
                </button>
              </div>

              {/* Google Chat */}
              <div className="flex items-center gap-1.5">
                <a
                  href={OFFICIAL_CHANNELS.googleChat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-between p-2.5 rounded-xl bg-[#063327] hover:bg-[#0A4736] border border-emerald-500/40 text-xs text-white transition group"
                  title="Open Google Chat for Online Services"
                >
                  <div className="flex items-center gap-2">
                    <GoogleChatIcon />
                    <span className="font-semibold text-emerald-300">Google Chat Online Services</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Open &rarr;
                  </span>
                </a>
                <button
                  onClick={() => setShowChatModal(true)}
                  title="Google Chat Instructions"
                  className="p-2.5 rounded-xl bg-[#0F284E] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Col 2: Social Media Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Official Social Media Channels</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Official university communities across verified social platforms:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href={OFFICIAL_CHANNELS.linkedin.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-[#0F284E] hover:bg-[#0077B5] border border-slate-700 transition text-slate-200 hover:text-white">
                <LinkedInIcon />
                <span className="truncate">LinkedIn</span>
              </a>
              <a href={OFFICIAL_CHANNELS.twitter.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-[#0F284E] hover:bg-black border border-slate-700 transition text-slate-200 hover:text-white">
                <TwitterIcon />
                <span className="truncate">Twitter / X</span>
              </a>
              <a href={OFFICIAL_CHANNELS.facebook.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-[#0F284E] hover:bg-[#1877F2] border border-slate-700 transition text-slate-200 hover:text-white">
                <FacebookIcon />
                <span className="truncate">Facebook</span>
              </a>
              <a href={OFFICIAL_CHANNELS.telegram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-lg bg-[#0F284E] hover:bg-[#229ED9] border border-slate-700 transition text-slate-200 hover:text-white">
                <TelegramIcon />
                <span className="truncate">Telegram</span>
              </a>
              <a href={OFFICIAL_CHANNELS.tiktok.url} target="_blank" rel="noopener noreferrer" className="col-span-2 flex items-center gap-2 p-2 rounded-lg bg-[#0F284E] hover:bg-rose-950/80 border border-slate-700 transition text-slate-200 hover:text-white">
                <TikTokIcon />
                <span className="truncate">TikTok (@ethiopiandefenceuniversity)</span>
              </a>
            </div>
          </div>

          {/* Col 3: Real Visitors Counter at Footer */}
          <div className="space-y-3 bg-[#050D1A] p-4 rounded-xl border border-amber-500/40 shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Real Visitors Counter</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{stats.activeNow} Online</span>
              </span>
            </div>

            {/* Odometer Digits */}
            <div className="flex items-center justify-center gap-1 py-1">
              {digits.map((digit, i) => (
                <span
                  key={i}
                  className="w-7 h-10 bg-[#0F284E] border border-amber-400/50 rounded-lg flex items-center justify-center font-mono font-black text-xl text-amber-300 shadow-md select-none"
                >
                  {digit}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <div className="bg-[#0A192F] p-1.5 rounded text-center">
                <span className="block text-slate-400">Today&apos;s Visits:</span>
                <strong className="text-white font-mono text-xs">{stats.todayVisits}</strong>
              </div>
              <div className="bg-[#0A192F] p-1.5 rounded text-center">
                <span className="block text-slate-400">Unique Visitors:</span>
                <strong className="text-emerald-400 font-mono text-xs">{stats.uniqueVisitors.toLocaleString()}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Modal for Google Chat */}
        {showChatModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0A192F] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <GoogleChatIcon />
                  <h3 className="text-base font-bold text-white">Google Chat Online Services</h3>
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <p>
                  Ethiopian Defence University provides direct online support via Google Workspace Chat for registered alumni and officers.
                </p>
                <div className="bg-[#0F284E] p-3.5 rounded-xl border border-slate-700 space-y-2">
                  <p className="font-semibold text-amber-300">How to Connect:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-300">
                    <li>Click <strong className="text-white">&ldquo;Launch Google Chat&rdquo;</strong> below.</li>
                    <li>Message the team directly at: <code className="bg-[#0A192F] px-1.5 py-0.5 rounded text-amber-400 font-mono">alumni-services@edu.et</code></li>
                    <li>Or join the official EDU Alumni Support Space.</li>
                  </ol>
                </div>
                <p className="text-[11px] text-slate-400">
                  Operating Hours: Monday – Friday, 8:30 AM – 5:30 PM (East Africa Time, UTC+3).
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowChatModal(false)}
                  className="px-4 py-2 bg-slate-800 text-xs rounded-lg text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <a
                  href={OFFICIAL_CHANNELS.googleChat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition"
                >
                  <span>Launch Google Chat</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-[#0A192F] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-white space-y-6 ${className}`}>
      
      {/* Top Section: Title & Real Visitor Counter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Official Online Services & Real Visitor Analytics</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Connect with Ethiopian Defence University Alumni Directorate
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Direct communication channels for graduation verification, career tracking, transcript requests, 
            and real-time institutional portal engagement.
          </p>
        </div>

        {/* REAL VISITOR COUNTER WIDGET */}
        <div className="bg-[#050D1A] border-2 border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-inner shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Eye className="w-3.5 h-3.5" />
              <span>Institutional Visitors Counter</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>{stats.activeNow} Live</span>
            </span>
          </div>

          {/* Digital Odometer Flip Digits */}
          <div className="flex items-center gap-1 justify-center py-1">
            {digits.map((digit, i) => (
              <span
                key={i}
                className="w-7 h-10 sm:w-8 sm:h-12 bg-[#0F284E] border border-amber-400/50 rounded-lg flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-amber-300 shadow-md select-none"
              >
                {digit}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
            <span>Today&apos;s Hits: <strong className="text-white">{stats.todayVisits}</strong></span>
            <span>Unique: <strong className="text-white">{stats.uniqueVisitors.toLocaleString()}</strong></span>
            <span className="text-emerald-400 font-medium">100% Real Live</span>
          </div>
        </div>
      </div>

      {/* ONLINE SERVICES: REAL MAILTO & GOOGLE CHAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 1. REAL MAILTO CARD */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#0F284E] to-[#133363] border border-blue-500/40 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Mail className="w-4 h-4 text-amber-400" />
                <span>Direct Mailto Service</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Official Inbox
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">alumni.affairs@edu.et</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Launch your default email client with a pre-formatted official inquiry directed to the Registrar & Alumni Affairs Directorate.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={OFFICIAL_CHANNELS.email.mailto}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Email Now</span>
            </a>
            <button
              onClick={handleCopyEmail}
              title="Copy email address"
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            </button>
          </div>
        </div>

        {/* 2. GOOGLE CHAT FOR ONLINE SERVICES */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#063327] to-[#0A4736] border border-emerald-500/40 shadow-lg flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <GoogleChatIcon />
                <span>Google Chat for Online Services</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live Support
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">Direct Google Workspace Chat</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Connect in real-time with the Alumni Track Record support team on Google Chat for expedited credentials verification and inquiries.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={OFFICIAL_CHANNELS.googleChat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Google Chat</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setShowChatModal(true)}
              className="px-3 py-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
            >
              Instructions
            </button>
          </div>
        </div>

      </div>

      {/* ALL REQUESTED SOCIAL CHANNELS */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official University Social Channels
          </span>
          <span className="text-[11px] text-amber-400">Verified Profiles</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* LinkedIn */}
          <a
            href={OFFICIAL_CHANNELS.linkedin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-[#0F284E] hover:bg-[#0077B5] border border-slate-700/70 hover:border-[#0077B5] transition flex items-center gap-3 text-white"
          >
            <div className="p-2 rounded-lg bg-blue-500/20 group-hover:bg-white/20 text-blue-400 group-hover:text-white transition">
              <LinkedInIcon />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate">LinkedIn</span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 block truncate">Professional</span>
            </div>
          </a>

          {/* Twitter / X */}
          <a
            href={OFFICIAL_CHANNELS.twitter.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-[#0F284E] hover:bg-black border border-slate-700/70 hover:border-slate-500 transition flex items-center gap-3 text-white"
          >
            <div className="p-2 rounded-lg bg-slate-700/40 group-hover:bg-white/20 text-slate-200 group-hover:text-white transition">
              <TwitterIcon />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate">Twitter / X</span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 block truncate">@EthiopianDefUni</span>
            </div>
          </a>

          {/* Facebook */}
          <a
            href={OFFICIAL_CHANNELS.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-[#0F284E] hover:bg-[#1877F2] border border-slate-700/70 hover:border-[#1877F2] transition flex items-center gap-3 text-white"
          >
            <div className="p-2 rounded-lg bg-blue-600/20 group-hover:bg-white/20 text-blue-400 group-hover:text-white transition">
              <FacebookIcon />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate">Facebook</span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 block truncate">Official Page</span>
            </div>
          </a>

          {/* Telegram */}
          <a
            href={OFFICIAL_CHANNELS.telegram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-[#0F284E] hover:bg-[#229ED9] border border-slate-700/70 hover:border-[#229ED9] transition flex items-center gap-3 text-white"
          >
            <div className="p-2 rounded-lg bg-sky-500/20 group-hover:bg-white/20 text-sky-400 group-hover:text-white transition">
              <TelegramIcon />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate">Telegram</span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 block truncate">Channel</span>
            </div>
          </a>

          {/* TikTok */}
          <a
            href={OFFICIAL_CHANNELS.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-xl bg-[#0F284E] hover:bg-rose-950/80 border border-slate-700/70 hover:border-rose-500 transition flex items-center gap-3 text-white col-span-2 sm:col-span-1"
          >
            <div className="p-2 rounded-lg bg-pink-500/20 group-hover:bg-rose-500/40 text-pink-400 group-hover:text-rose-200 transition">
              <TikTokIcon />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold block truncate">TikTok</span>
              <span className="text-[10px] text-slate-400 group-hover:text-slate-200 block truncate">@ethiopiandefence</span>
            </div>
          </a>

        </div>
      </div>

      {/* GOOGLE CHAT INSTRUCTIONS MODAL */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A192F] border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GoogleChatIcon />
                <h3 className="text-base font-bold text-white">Google Chat Online Services</h3>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Ethiopian Defence University provides direct online support via Google Workspace Chat for registered alumni and officers.
              </p>
              <div className="bg-[#0F284E] p-3.5 rounded-xl border border-slate-700 space-y-2">
                <p className="font-semibold text-amber-300">How to Connect:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300">
                  <li>Click <strong className="text-white">&ldquo;Open Google Chat&rdquo;</strong> to launch Google Chat on web or mobile.</li>
                  <li>Start a direct chat with: <code className="bg-[#0A192F] px-1.5 py-0.5 rounded text-amber-400 font-mono">alumni-services@edu.et</code></li>
                  <li>Or request admission to the <strong className="text-white">&ldquo;EDU Alumni Support Space&rdquo;</strong>.</li>
                </ol>
              </div>
              <p className="text-[11px] text-slate-400">
                Operating Hours: Monday – Friday, 8:30 AM – 5:30 PM (East Africa Time, UTC+3).
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowChatModal(false)}
                className="px-4 py-2 bg-slate-800 text-xs rounded-lg text-slate-300 hover:text-white"
              >
                Close
              </button>
              <a
                href={OFFICIAL_CHANNELS.googleChat.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition"
              >
                <span>Launch Google Chat</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
