import React, { useState, useEffect } from 'react';
import { 
  Video, Shield, Sliders, FileText, Globe, Key, Lock, Unlock, 
  MessageSquare, Monitor, Mic, Camera, Play, Pause, Users, CheckCircle2 
} from 'lucide-react';
import { AccessType, Moderation } from '../types';

export default function InfoHub() {
  const [activeTab, setActiveTab] = useState<'spaces' | 'access' | 'moderation' | 'artifacts'>('spaces');
  
  // Tab 1 States: Space creator mock
  const [mockAccess, setMockAccess] = useState<AccessType>('TRUSTED');
  const [mockModeration, setMockModeration] = useState<boolean>(true);
  
  // Tab 3 States: Host control simulation
  const [allowScreenShare, setAllowScreenShare] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [muteAll, setMuteAll] = useState(false);
  const [cameraLock, setCameraLock] = useState(false);

  // Tab 4 States: Transcript playback simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const transcriptLines = [
    { time: '0:02', speaker: 'Sarah (Host)', text: 'Hello everyone! Thanks for joining today\'s sync on the Workspace integration.' },
    { time: '0:08', speaker: 'Sarah (Host)', text: 'We are demonstrating how Google Meet v2 APIs enable developers to control spaces.' },
    { time: '0:14', speaker: 'Alex (Product)', text: 'This is great! Can we dynamically change access settings while the meeting is live?' },
    { time: '0:19', speaker: 'Sarah (Host)', text: 'Yes! The spaces.patch API lets you update AccessType and Moderation restrictions on-the-fly.' },
    { time: '0:25', speaker: 'Alex (Product)', text: 'Awesome, that makes scheduling and securing meetings extremely simple!' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          if (prev >= 28) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div id="info-hub" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-6 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">What You Can Do With Google Meet</h2>
            <p className="text-sm text-slate-500">Discover the full capabilities of the Google Meet API v2</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-none bg-slate-50/50">
        <button
          id="tab-spaces"
          onClick={() => setActiveTab('spaces')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'spaces' 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Globe className="w-4 h-4" />
          Instant & Persistent Spaces
        </button>
        <button
          id="tab-access"
          onClick={() => setActiveTab('access')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'access' 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Shield className="w-4 h-4" />
          Access Security
        </button>
        <button
          id="tab-moderation"
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'moderation' 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          In-Call Moderation
        </button>
        <button
          id="tab-artifacts"
          onClick={() => setActiveTab('artifacts')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'artifacts' 
              ? 'border-blue-600 text-blue-600 bg-white' 
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Recordings & Transcripts
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 md:p-8">
        {activeTab === 'spaces' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Features</span>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">On-Demand Persistent Rooms</h3>
              <p className="text-slate-600 leading-relaxed">
                The Google Meet API allows apps to dynamically provision virtual spaces on-demand. Unlike legacy video links, these spaces are <strong>persistent</strong> and stay active so you can reuse them for recurring classes, standups, or customer service lines.
              </p>
              <ul className="space-y-2 text-slate-600 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Instant Link Generation:</strong> Get clickable meeting URLs and clean 10-character alphanumeric codes (e.g., <code>abc-defg-hij</code>) immediately.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Zero Expiration:</strong> Reuse spaces securely across days, weeks, or months without losing settings.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Pre-Configured Environments:</strong> Define meeting settings before anybody even logs in.</span>
                </li>
              </ul>
            </div>
            
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live API Concept Demo</h4>
              <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm space-y-3 font-mono text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-blue-600 font-bold">POST /v2/spaces</span>
                  <span className="text-emerald-600">200 OK</span>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">// Response Payload</p>
                  <p><span className="text-purple-600">"name"</span>: <span className="text-emerald-700">"spaces/meet-sync-room"</span>,</p>
                  <p><span className="text-purple-600">"meetingUri"</span>: <span className="text-emerald-700">"https://meet.google.com/abc-defg-hij"</span>,</p>
                  <p><span className="text-purple-600">"meetingCode"</span>: <span className="text-emerald-700">"abc-defg-hij"</span>,</p>
                  <p><span className="text-purple-600">"config"</span>: &#123;</p>
                  <p className="pl-4"><span className="text-purple-600">"accessType"</span>: <span className="text-emerald-700">"TRUSTED"</span>,</p>
                  <p className="pl-4"><span className="text-purple-600">"entryPointAccess"</span>: <span className="text-emerald-700">"ALL"</span></p>
                  <p>&#125;</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <a href="#space-creator" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Try creating a real space below &rarr;
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'access' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Access Controls</span>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Granular Entry & Security Settings</h3>
              <p className="text-slate-600 leading-relaxed">
                Control exactly who can join your meeting room and how they gain access. The Meet API v2 lets you programmatically define security postures before the conference starts.
              </p>
              
              {/* Access Levels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className={`p-4 rounded-xl border transition-all ${mockAccess === 'OPEN' ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-xs text-slate-800">OPEN</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Anyone with the link can join directly. No host knock required.</p>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${mockAccess === 'TRUSTED' ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-bold text-xs text-slate-800">TRUSTED</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Organization members & invited guests bypass knock. Others must request.</p>
                </div>
                <div className={`p-4 rounded-xl border transition-all ${mockAccess === 'RESTRICTED' ? 'border-blue-500 bg-blue-50/20' : 'border-slate-100 bg-slate-50/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-rose-500" />
                    <span className="font-bold text-xs text-slate-800">RESTRICTED</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Only explicitly invited Google Account users can request to join.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Interactive Security Simulator</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Configure Access Level</label>
                  <div className="flex bg-white p-1 rounded-lg border border-slate-100 shadow-xs">
                    {(['OPEN', 'TRUSTED', 'RESTRICTED'] as AccessType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setMockAccess(type)}
                        className={`flex-1 py-1 px-2.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                          mockAccess === type ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-xs">
                  <div>
                    <p className="text-xs font-bold text-slate-700">Host Moderation</p>
                    <p className="text-[10px] text-slate-400">Require host to approve knockers</p>
                  </div>
                  <button
                    onClick={() => setMockModeration(!mockModeration)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      mockModeration ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      mockModeration ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Simulated Google Meet Lobby Screen */}
                <div className="bg-slate-900 text-white rounded-xl p-4 font-sans border border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-slate-400 font-semibold tracking-wide">GOOGLE MEET PREVIEW</span>
                    <span className="text-[9px] bg-red-600 px-1.5 py-0.5 rounded text-white font-bold">LOBBY</span>
                  </div>
                  <div className="text-center py-2 space-y-1">
                    <p className="text-xs font-semibold">User: <span className="text-slate-300">john.doe@gmail.com</span></p>
                    <div className="flex items-center justify-center gap-1.5 py-1">
                      {mockAccess === 'OPEN' ? (
                        <>
                          <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px] text-emerald-400 font-semibold">Instant Ingress Enabled</span>
                        </>
                      ) : mockAccess === 'TRUSTED' ? (
                        <>
                          <Users className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-[11px] text-blue-400 font-semibold">Bypass if Invite/Org</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-rose-400" />
                          <span className="text-[11px] text-rose-400 font-semibold">Strict Auth Required</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Join Action button mockup */}
                  <div className="bg-slate-800 p-2 rounded-lg text-center text-[11px] font-medium text-slate-300">
                    {mockAccess === 'OPEN' ? (
                      <span className="text-emerald-400 font-bold">Entering meeting instantly...</span>
                    ) : mockModeration ? (
                      <span>Waiting for Host Approval (Knocking...)</span>
                    ) : (
                      <span>Bypassing Lobby (Host Moderation OFF)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Moderation Controls</span>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Active In-Call Host Locks</h3>
              <p className="text-slate-600 leading-relaxed">
                Empower hosts to guide the session seamlessly by setting participant restrictions. Using the Google Meet API v2, the host can toggle central locks for chats, microphones, and video feeds dynamically or before the meeting begins.
              </p>
              <ul className="space-y-2 text-slate-600 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Default Roles:</strong> Set users to join as full participants or mute-by-default viewers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Collaboration Locks:</strong> Prevent unauthorized screen-sharing or high-volume chat flooding.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>AV Controls:</strong> Enable a clean, quiet workspace by securing microphone and camera statuses.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Host Control Simulator</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-700">Allow Screen Share</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={allowScreenShare} 
                    onChange={() => setAllowScreenShare(!allowScreenShare)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-medium text-slate-700">Allow Chat Messages</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={allowChat} 
                    onChange={() => setAllowChat(!allowChat)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Mic className={`w-4 h-4 ${muteAll ? 'text-red-500' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium text-slate-700">Mute All Microphones</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={muteAll} 
                    onChange={() => setMuteAll(!muteAll)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Camera className={`w-4 h-4 ${cameraLock ? 'text-red-500' : 'text-slate-500'}`} />
                    <span className="text-xs font-medium text-slate-700">Lock Cameras</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={cameraLock} 
                    onChange={() => setCameraLock(!cameraLock)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>

                {/* Live Mock Screen Reflection */}
                <div className="bg-slate-900 rounded-xl p-3 text-white text-[11px] font-mono border border-slate-800">
                  <div className="text-center font-bold text-slate-400 mb-2 border-b border-slate-800 pb-1 uppercase text-[9px] tracking-widest">
                    Live Session Feed Mockup
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Share Screen:</span>
                      <span className={allowScreenShare ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                        {allowScreenShare ? 'ENABLED' : 'LOCKED BY HOST'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Chat Box:</span>
                      <span className={allowChat ? 'text-emerald-400' : 'text-red-400 font-bold'}>
                        {allowChat ? 'ACTIVE' : 'MUTED BY HOST'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Mic State:</span>
                      <span className={muteAll ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {muteAll ? 'MUTED (HOST OVERRIDE)' : 'OPEN'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Video Feed:</span>
                      <span className={cameraLock ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                        {cameraLock ? 'CAMERAS DISABLED' : 'CAMERA ACTIVE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artifacts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">Post-Meeting Data</span>
              <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Recordings, Transcripts & Summaries</h3>
              <p className="text-slate-600 leading-relaxed">
                Google Meet seamlessly outputs meeting artifacts. When enabled, video recordings, full text transcripts, and AI-generated smart meeting notes are generated and placed directly inside the host's Google Drive.
              </p>
              <ul className="space-y-2 text-slate-600 pt-2">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>High-Fidelity Recordings:</strong> Automatic MP4 outputs saved directly to Drive.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>AI-Enabled Transcripts:</strong> Generates timestamped logs searchable for keywords.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Smart Note Summaries:</strong> Meet automatically outputs actions items and summaries.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interactive Player</h4>
                <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-1.5 py-0.5 rounded">Recording Mockup</span>
              </div>
              
              {/* Transcript & Player Mockup */}
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                {/* Simulated Waveform / Timer */}
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 px-4">
                    <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${(playbackTime / 28) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{formatTime(playbackTime)} / 0:28</span>
                </div>

                {/* Simulated Scrollable Transcript */}
                <div className="p-3.5 h-[160px] overflow-y-auto text-xs space-y-2.5 scrollbar-thin scrollbar-thumb-slate-200">
                  {transcriptLines.map((line, index) => {
                    const lineSeconds = parseInt(line.time.split(':')[1]);
                    const isHighlighted = playbackTime >= lineSeconds && playbackTime < lineSeconds + 6;
                    return (
                      <div 
                        key={index} 
                        className={`p-2 rounded-lg transition-colors duration-300 ${
                          isHighlighted ? 'bg-blue-50 border-l-2 border-blue-600' : 'bg-slate-50/50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="font-bold text-slate-700">{line.speaker}</span>
                          <span className="text-[10px] text-slate-400">{line.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{line.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
