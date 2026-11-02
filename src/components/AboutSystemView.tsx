/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UniversityLogo } from './UniversityLogo';
import { API_DOCUMENTATION, ApiEndpointDoc } from '../data/apiDocumentation';
import { 
  Info, 
  Globe, 
  Code, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Server, 
  ExternalLink,
  ChevronRight,
  Play
} from 'lucide-react';

export const AboutSystemView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'integration' | 'api' | 'deployment'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // API Tester State
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointDoc>(API_DOCUMENTATION[0]);
  const [apiTestResponse, setApiTestResponse] = useState<any>(null);
  const [isCallingApi, setIsCallingApi] = useState<boolean>(false);

  // Iframe preview state
  const [iframeHeight, setIframeHeight] = useState<'compact' | 'standard' | 'tall'>('standard');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTestApi = async (endpoint: ApiEndpointDoc) => {
    setIsCallingApi(true);
    // Simulate real fetch or call relative endpoint
    try {
      const res = await fetch(endpoint.path);
      if (res.ok) {
        const json = await res.json();
        setApiTestResponse(json);
      } else {
        // Fallback to sample response
        setApiTestResponse(endpoint.sampleResponse);
      }
    } catch {
      setApiTestResponse(endpoint.sampleResponse);
    } finally {
      setIsCallingApi(false);
    }
  };

  const iframeEmbedCode = `<iframe 
  src="https://alumni.edu.et/embed/dashboard" 
  title="Ethiopian Defence University Alumni Analytics" 
  width="100%" 
  height="700px" 
  frameborder="0" 
  style="border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px; overflow: hidden;"
  allow="fullscreen">
</iframe>`;

  const nginxReverseProxyConf = `# NGINX Reverse Proxy Configuration for alumni.edu.et
server {
    listen 443 ssl http2;
    server_name alumni.edu.et;

    ssl_certificate /etc/ssl/certs/edu_alumni_cert.pem;
    ssl_certificate_key /etc/ssl/private/edu_alumni_key.key;

    # Security Headers
    add_header X-Frame-Options "ALLOW-FROM https://www.edu.et" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # CORS configuration for official university portal
    add_header 'Access-Control-Allow-Origin' 'https://www.edu.et' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Title Header */}
      <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <UniversityLogo size="md" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-serif font-bold text-base sm:text-lg text-amber-400">
                የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
              </span>
              <span className="text-amber-500/50 font-bold hidden sm:inline">•</span>
              <span className="font-serif font-bold text-base sm:text-lg text-amber-400">
                ETHIOPIAN DEFENCE UNIVERSITY
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Alumni Track Record Database (EDU-ATRD) Architecture & Official Website Integration Hub
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-[#0F284E] p-1.5 rounded-xl border border-slate-700 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'overview' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            System Mandate
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'integration' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Website Integration
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'api' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            REST API Console
          </button>
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'deployment' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Deployment
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & MANDATE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#071326] via-[#0A192F] to-[#122B55] border border-amber-500/30 rounded-2xl p-8 text-white space-y-4 shadow-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Institutional Purpose & Legislative Foundation</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">
              Connecting Graduate Achievements, Monitoring Career Progression, and Supporting Institutional Excellence
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              The Ethiopian Defence University Alumni Track Record Database (EDU-ATRD) was engineered to serve as
              the sovereign digital repository of academic credentials and career records for all officers and civilian
              professionals trained by the University.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700 space-y-1">
                <span className="text-amber-400 font-bold block">1999 Inception Baseline</span>
                <p>Accommodates historical records beginning with the 1999 first Diploma graduate batch and subsequent cohorts.</p>
              </div>
              <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700 space-y-1">
                <span className="text-blue-400 font-bold block">Tri-Collegiate Structure</span>
                <p>College of Engineering, College of Health Sciences, and College of Business & Social Studies.</p>
              </div>
              <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700 space-y-1">
                <span className="text-emerald-400 font-bold block">Evidence-Based Planning</span>
                <p>Equips academic leadership with empirical tracer data for curriculum reviews, accreditation, and national defence planning.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WEBSITE INTEGRATION METHODS */}
      {activeTab === 'integration' && (
        <div className="space-y-6">
          <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Three Main Integration Pathways</h3>
              <p className="text-xs text-slate-400 mt-1">
                Designed to operate independently while embedding cleanly into the official university portal (<code className="text-amber-400 font-mono">www.edu.et</code>).
              </p>
            </div>

            {/* Option A: Subdomain */}
            <div className="p-5 bg-[#0F284E] rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">Option A: Subdomain Integration (alumni.edu.et)</h4>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">Recommended</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Configure a DNS CNAME record pointing <code className="text-amber-300 font-mono">alumni.edu.et</code> to your deployed university host server. Below is the production NGINX reverse proxy configuration with SSL termination:
              </p>
              <div className="relative">
                <pre className="p-4 bg-[#050B14] text-xs font-mono text-slate-300 rounded-lg overflow-x-auto max-h-48 border border-slate-800">
                  {nginxReverseProxyConf}
                </pre>
                <button
                  onClick={() => copyToClipboard(nginxReverseProxyConf, 'nginx')}
                  className="absolute top-2 right-2 p-1.5 bg-[#0F284E] hover:bg-slate-700 rounded text-slate-300 text-xs flex items-center gap-1"
                >
                  {copiedCode === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'nginx' ? 'Copied' : 'Copy Conf'}</span>
                </button>
              </div>
            </div>

            {/* Option B: Embedded iFrame */}
            <div className="p-5 bg-[#0F284E] rounded-xl border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-white">Option B: Website Embedded Integration (iframe)</h4>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">Zero-Code Embed</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Embed the public statistical dashboard directly inside existing WordPress, Drupal, or custom HTML pages of the official university website.
              </p>
              <div className="relative">
                <pre className="p-4 bg-[#050B14] text-xs font-mono text-amber-300 rounded-lg overflow-x-auto border border-slate-800">
                  {iframeEmbedCode}
                </pre>
                <button
                  onClick={() => copyToClipboard(iframeEmbedCode, 'iframe')}
                  className="absolute top-2 right-2 p-1.5 bg-[#0F284E] hover:bg-slate-700 rounded text-slate-300 text-xs flex items-center gap-1"
                >
                  {copiedCode === 'iframe' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'iframe' ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: REST API CONSOLE */}
      {activeTab === 'api' && (
        <div className="space-y-6">
          <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-amber-400" />
                <span>Option C: REST API Endpoints & Interactive Tester</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Enables the official university website to programmatically query approved statistics and render them natively.
              </p>
            </div>

            {/* Endpoints List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {API_DOCUMENTATION.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => { setSelectedEndpoint(ep); setApiTestResponse(null); }}
                  className={`p-3 text-left rounded-xl border transition ${
                    selectedEndpoint.path === ep.path
                      ? 'bg-[#0F284E] border-amber-400 text-white shadow'
                      : 'bg-[#0A192F] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400">
                      {ep.method}
                    </span>
                    <span className="text-xs font-mono font-bold text-white truncate">{ep.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 truncate">{ep.summary}</p>
                </button>
              ))}
            </div>

            {/* Selected Endpoint Details & Test Execution */}
            <div className="bg-[#0F284E] p-5 rounded-xl border border-slate-700 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400">
                      {selectedEndpoint.method}
                    </span>
                    <span className="font-mono text-sm font-bold text-white">{selectedEndpoint.path}</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{selectedEndpoint.description}</p>
                </div>

                <button
                  onClick={() => handleTestApi(selectedEndpoint)}
                  disabled={isCallingApi}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-lg transition shadow shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isCallingApi ? 'Querying...' : 'Test Endpoint Live'}</span>
                </button>
              </div>

              {/* Sample / Live Response */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold mb-1">
                  Response Payload (JSON):
                </span>
                <pre className="p-4 bg-[#050B14] rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 max-h-72 overflow-y-auto">
                  {JSON.stringify(apiTestResponse || selectedEndpoint.sampleResponse, null, 2)}
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4: DEPLOYMENT */}
      {activeTab === 'deployment' && (
        <div className="space-y-6">
          <div className="bg-[#0A192F] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="text-base font-serif font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-400" />
              <span>Production Deployment & Server Guide</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-white">1. Prerequisites</h4>
                <p>• Node.js 20+ runtime environment or Docker container.</p>
                <p>• PostgreSQL 15+ database instance (or Cloud SQL / RDS).</p>
                <p>• Valid SSL certificate for <code className="text-amber-400">alumni.edu.et</code>.</p>
              </div>

              <div className="bg-[#0F284E] p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-white">2. Build & Launch Instructions</h4>
                <div className="p-3 bg-[#050B14] rounded font-mono text-slate-300 space-y-1">
                  <p className="text-emerald-400"># Install dependencies</p>
                  <p>npm install</p>
                  <p className="text-emerald-400 mt-2"># Build optimized frontend bundle</p>
                  <p>npm run build</p>
                  <p className="text-emerald-400 mt-2"># Start production server</p>
                  <p>node server.ts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
