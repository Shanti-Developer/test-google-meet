import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Video, LogOut, Shield, Globe, Info, Sparkles, BookOpen, 
  Terminal, ShieldCheck, HeartHandshake, CheckCircle2 
} from 'lucide-react';
import { initAuth, googleSignIn, logout } from './auth';
import InfoHub from './components/InfoHub';
import SpaceManager from './components/SpaceManager';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [appTab, setAppTab] = useState<'manager' | 'guide'>('manager');

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, accessToken) => {
        setUser(authUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Authentication failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setAppTab('manager'); // Reset tab
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-800 antialiased">
      
      {/* Upper Utility Indicator: Clean, humble label */}
      <div className="bg-slate-900 text-slate-400 py-2.5 px-4 text-xs font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-mono text-[11px] text-slate-300">Google Meet v2 API Integration Active</span>
          </div>
          <p className="text-[10px] text-slate-400">Secure Client-to-API Workspace Integration Channel</p>
        </div>
      </div>

      {/* Main Header / Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-sm shadow-blue-500/20 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-tight">Google Meet Manager</h1>
              <p className="text-[11px] text-slate-400 font-medium">Dynamically configure persistent video conference spaces</p>
            </div>
          </div>

          {/* Right Header Controls */}
          {user && (
            <div className="flex items-center gap-4">
              {/* User profile capsule */}
              <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                <img 
                  src={user.photoURL || 'https://lh3.googleusercontent.com/a/default-user=s40-c'} 
                  alt={user.displayName || 'Profile'} 
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full border border-white"
                />
                <div className="text-left shrink-0">
                  <p className="text-xs font-bold text-slate-700 leading-none">{user.displayName}</p>
                  <p className="text-[9px] text-slate-400 leading-none mt-0.5">{user.email}</p>
                </div>
              </div>

              {/* Logout button */}
              <button
                id="btn-logout"
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-semibold text-xs py-2 px-3.5 rounded-xl cursor-pointer transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Primary Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
        
        {/* LANDING PAGE (When unauthenticated) */}
        {needsAuth ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Hero Intro */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
                Workspace OAuth Integration App
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Securely Create & Moderate <span className="text-blue-600">Google Meet</span> on Demand
              </h2>

              <p className="text-slate-600 leading-relaxed md:text-lg">
                Connect your Google Account with absolute peace of mind. Generate instant, reusable video call links and customize access permissions, entry restrictions, and host settings before your participants connect.
              </p>

              {/* Authentication action wrapper */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-slate-800">Step 1: Authenticate with Google</p>
                  <p className="text-xs text-slate-500">We will securely request permission to create and configure meeting spaces on your behalf.</p>
                </div>

                {/* Google branded sign in button */}
                <button 
                  id="btn-google-signin"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="gsi-material-button w-full sm:w-auto shadow-xs hover:shadow-md cursor-pointer transition-all disabled:opacity-50"
                  style={{ minWidth: '220px' }}
                >
                  <div className="gsi-material-button-state"></div>
                  <div className="gsi-material-button-content-wrapper">
                    <div className="gsi-material-button-icon">
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: "block" }}>
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                    </div>
                    <span className="gsi-material-button-contents">
                      {isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Secure authorization values list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex gap-3 items-start">
                  <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Authorized Scopes</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">Operates with explicit permission to spaces.created, space.readonly, and space.settings.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <HeartHandshake className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Privacy & Security First</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">No credentials or private meeting tokens are ever stored on cloud servers. Kept fully client-side.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive educational hub */}
            <div className="lg:col-span-6">
              <InfoHub />
            </div>

          </div>
        ) : (
          
          /* APP WORKSPACE (When authenticated) */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Tab navigation inside workspace */}
            <div className="flex border-b border-slate-200">
              <button
                id="workspace-tab-manager"
                onClick={() => setAppTab('manager')}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  appTab === 'manager' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Video className="w-4.5 h-4.5" />
                Space Creator & Settings Manager
              </button>
              <button
                id="workspace-tab-guide"
                onClick={() => setAppTab('guide')}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  appTab === 'guide' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <BookOpen className="w-4.5 h-4.5" />
                Meet Capability Explorer Guide
              </button>
            </div>

            {/* Render selected workspace tab */}
            {appTab === 'manager' && token && user ? (
              <SpaceManager accessToken={token} userEmail={user.email || 'guest'} />
            ) : (
              <div className="max-w-4xl mx-auto">
                <InfoHub />
              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-10 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slate-500">Google Meet Manager</span>
          </div>
          <p>© 2026 Google AI Studio Applet. Powered by Antigravity Agent and Gemini models.</p>
        </div>
      </footer>

    </div>
  );
}
