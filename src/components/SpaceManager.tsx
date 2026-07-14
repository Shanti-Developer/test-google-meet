import React, { useState, useEffect } from 'react';
import { 
  Plus, Settings, Video, ExternalLink, RefreshCw, Trash2, Shield, 
  Check, AlertTriangle, Info, Sliders, Globe, Users, Lock, X, Play 
} from 'lucide-react';
import { Space, SpaceConfig, AccessType, EntryPointAccess, Moderation } from '../types';

interface SpaceManagerProps {
  accessToken: string;
  userEmail: string;
}

export default function SpaceManager({ accessToken, userEmail }: SpaceManagerProps) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Creation States
  const [newAccessType, setNewAccessType] = useState<AccessType>('TRUSTED');
  const [newEntryPointAccess, setNewEntryPointAccess] = useState<EntryPointAccess>('ALL');
  const [newModeration, setNewModeration] = useState<Moderation>('ON');

  // Editing States
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [editAccessType, setEditAccessType] = useState<AccessType>('TRUSTED');
  const [editEntryPointAccess, setEditEntryPointAccess] = useState<EntryPointAccess>('ALL');
  const [editModeration, setEditModeration] = useState<Moderation>('ON');
  const [updating, setUpdating] = useState(false);

  // Load spaces from localStorage for this specific user
  useEffect(() => {
    const cached = localStorage.getItem(`gmeet_spaces_${userEmail}`);
    if (cached) {
      try {
        setSpaces(JSON.parse(cached));
      } catch (e) {
        console.error('Error loading cached spaces', e);
      }
    }
  }, [userEmail]);

  // Save spaces to localStorage
  const saveSpaces = (updated: Space[]) => {
    setSpaces(updated);
    localStorage.setItem(`gmeet_spaces_${userEmail}`, JSON.stringify(updated));
  };

  // Create a new Meet Space
  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload: any = {
        config: {
          accessType: newAccessType,
          entryPointAccess: newEntryPointAccess,
          moderation: newModeration,
        }
      };

      const res = await fetch('https://meet.googleapis.com/v2/spaces', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error?.message || 'Failed to create meeting space. Please verify API authorization.');
      }

      const createdSpace: Space = await res.json();
      
      // Since Google Meet v2 may sometimes omit empty fields or return unspecified, let's normalize
      const finalSpace: Space = {
        ...createdSpace,
        config: {
          accessType: createdSpace.config?.accessType || newAccessType,
          entryPointAccess: createdSpace.config?.entryPointAccess || newEntryPointAccess,
          moderation: createdSpace.config?.moderation || newModeration,
        }
      };

      const updatedList = [finalSpace, ...spaces];
      saveSpaces(updatedList);
      setSuccessMsg(`Google Meet space generated successfully! Code: ${finalSpace.meetingCode}`);

      // Flash success
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while creating the space.');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Panel
  const startEditing = (space: Space) => {
    setEditingSpace(space);
    setEditAccessType(space.config?.accessType || 'TRUSTED');
    setEditEntryPointAccess(space.config?.entryPointAccess || 'ALL');
    setEditModeration(space.config?.moderation || 'ON');
    setError(null);
  };

  // Close Edit Panel
  const cancelEditing = () => {
    setEditingSpace(null);
  };

  // Update space settings via PATCH
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpace) return;

    // MANDATORY Confirmation Dialog for mutating user data
    const confirmed = window.confirm(
      `Are you sure you want to update the settings of Google Meet Space (${editingSpace.meetingCode}) on the Google servers?\n\nNew configuration will take effect instantly for all participants.`
    );
    if (!confirmed) return;

    setUpdating(true);
    setError(null);

    try {
      const payload = {
        name: editingSpace.name,
        config: {
          accessType: editAccessType,
          entryPointAccess: editEntryPointAccess,
          moderation: editModeration,
        }
      };

      // Meet API PATCH requires name as resource path and updateMask as query parameter
      const res = await fetch(`https://meet.googleapis.com/v2/${editingSpace.name}?updateMask=config.accessType,config.entryPointAccess,config.moderation`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error?.message || 'Failed to update space settings.');
      }

      const updatedSpace: Space = await res.json();

      // Update in our list
      const updatedList = spaces.map(s => {
        if (s.name === editingSpace.name) {
          return {
            ...s,
            config: {
              accessType: updatedSpace.config?.accessType || editAccessType,
              entryPointAccess: updatedSpace.config?.entryPointAccess || editEntryPointAccess,
              moderation: updatedSpace.config?.moderation || editModeration,
            }
          };
        }
        return s;
      });

      saveSpaces(updatedList);
      setSuccessMsg(`Space ${editingSpace.meetingCode} configuration updated successfully!`);
      setEditingSpace(null);

      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while updating settings.');
    } finally {
      setUpdating(false);
    }
  };

  // End active conference (advanced feature)
  const handleEndConference = async (space: Space) => {
    const confirmed = window.confirm(
      `Are you sure you want to FORCE END any active call/conference in Space ${space.meetingCode}?\n\nThis will immediately disconnect all active speakers and participants.`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://meet.googleapis.com/v2/${space.name}:endActiveConference`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        // If there's no active conference, it might fail, catch that gracefully
        throw new Error(errBody.error?.message || 'Failed to end active conference. There may be no ongoing call currently.');
      }

      setSuccessMsg(`Active conference in Space ${space.meetingCode} has been closed.`);
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      setError(err.message || 'An error occurred while terminating the conference.');
    } finally {
      setLoading(false);
    }
  };

  // Remove space from local dashboard
  const handleRemoveSpace = (space: Space) => {
    const confirmed = window.confirm(
      `Remove Space ${space.meetingCode} from your dashboard?\n\nNote: The space remains active on Google servers, but it will no longer be tracked in this application.`
    );
    if (!confirmed) return;

    const filtered = spaces.filter(s => s.name !== space.name);
    saveSpaces(filtered);
    setSuccessMsg('Meeting space removed from local dashboard list.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
      
      {/* LEFT COLUMN: Create Space Form & Notifications */}
      <div className="xl:col-span-4 space-y-6">
        
        {/* Alerts Block */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex gap-2.5 items-start">
            <AlertTriangle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Operation Failed</p>
              <p className="text-xs text-red-600 leading-normal">{error}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm flex gap-2.5 items-start shadow-xs">
            <Check className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <p className="font-semibold">Success</p>
              <p className="text-xs text-emerald-700 leading-normal">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Space Creator Card */}
        <div id="space-creator" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Video className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Generate New Meeting</h3>
          </div>

          <form onSubmit={handleCreateSpace} className="space-y-5">
            
            {/* Access Type Cards */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Space Access Policy</label>
              <div className="grid grid-cols-3 gap-2">
                {(['OPEN', 'TRUSTED', 'RESTRICTED'] as AccessType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewAccessType(type)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      newAccessType === type 
                        ? 'border-blue-600 bg-blue-50/20 text-blue-700 font-bold shadow-xs' 
                        : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-wide">{type}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                {newAccessType === 'OPEN' && 'Anyone can enter directly. Ideal for public events.'}
                {newAccessType === 'TRUSTED' && 'Team members bypass lobby. Guests ask host to enter.'}
                {newAccessType === 'RESTRICTED' && 'Strict Google Account check. Invite-only access.'}
              </p>
            </div>

            {/* Entry Point Access */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Join Mode Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewEntryPointAccess('ALL')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-medium ${
                    newEntryPointAccess === 'ALL'
                      ? 'border-blue-600 bg-blue-50/20 text-blue-700 font-bold'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Entry Points
                </button>
                <button
                  type="button"
                  onClick={() => setNewEntryPointAccess('CREATOR_ONLY')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer text-xs font-medium ${
                    newEntryPointAccess === 'CREATOR_ONLY'
                      ? 'border-blue-600 bg-blue-50/20 text-blue-700 font-bold'
                      : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Creator Only
                </button>
              </div>
            </div>

            {/* Moderation Mode */}
            <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700">Host Moderation Locks</span>
                <span className="block text-[10px] text-slate-400">Lock chats or screens</span>
              </div>
              <div className="flex bg-white p-1 rounded-lg border border-slate-100 shadow-xs shrink-0">
                {(['ON', 'OFF'] as Moderation[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setNewModeration(mode)}
                    className={`px-3 py-1 text-xs font-bold rounded-md cursor-pointer transition-all ${
                      newModeration === mode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Space...
                </>
              ) : (
                <>
                  <Plus className="w-4.5 h-4.5" />
                  Create Google Meet Space
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info notice about persistence */}
        <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-slate-600 text-xs flex gap-3 leading-relaxed">
          <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">Client-Side Synchronization</p>
            <p>Google Meet v2 spaces are stored in your localized dashboard cache for rapid access. Configuration changes are synchronized directly to Google Cloud via the Meet API.</p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Active Spaces List & Editor */}
      <div className="xl:col-span-8 space-y-6">

        {/* Edit Panel (Conditional) */}
        {editingSpace && (
          <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6 shadow-xs space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-blue-100/60 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600 animate-spin-slow" />
                <h4 className="font-bold text-slate-800">
                  Configure Settings: <span className="font-mono text-blue-600">{editingSpace.meetingCode}</span>
                </h4>
              </div>
              <button 
                onClick={cancelEditing}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateSettings} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Access Type</label>
                <select
                  value={editAccessType}
                  onChange={(e) => setEditAccessType(e.target.value as AccessType)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="OPEN">OPEN (Free Access)</option>
                  <option value="TRUSTED">TRUSTED (Bypass for Org)</option>
                  <option value="RESTRICTED">RESTRICTED (Invite Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Join Modes</label>
                <select
                  value={editEntryPointAccess}
                  onChange={(e) => setEditEntryPointAccess(e.target.value as EntryPointAccess)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ALL">ALL (Standard Phone/Web)</option>
                  <option value="CREATOR_ONLY">CREATOR_ONLY</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Moderation</label>
                <select
                  value={editModeration}
                  onChange={(e) => setEditModeration(e.target.value as Moderation)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ON">ON (Lock Screen/Chats)</option>
                  <option value="OFF">OFF (Everyone Cooperates)</option>
                </select>
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 pt-2 border-t border-blue-100/40">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-sm cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Save Configurations
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dashboard Room List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Your Persistent Google Meet Rooms</h3>
              <p className="text-xs text-slate-500">Manage, edit, and access your dynamically configured rooms</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full">
              {spaces.length} Spaces Cached
            </span>
          </div>

          {spaces.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-slate-700">No meeting spaces found</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">Generate your first persistent Google Meet space using the form on the left to test live settings integration!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spaces.map((space) => (
                <div 
                  key={space.name}
                  className="p-5 rounded-xl border border-slate-100 hover:border-blue-100 hover:shadow-xs transition-all duration-300 flex flex-col justify-between space-y-4 relative bg-slate-50/20"
                >
                  
                  {/* Card Top: Code and controls */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        {space.meetingCode}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEditing(space)}
                          title="Configure settings"
                          className="p-1.5 hover:bg-slate-100 hover:text-blue-600 rounded text-slate-400 transition-all cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEndConference(space)}
                          title="Force end active call"
                          className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded text-slate-400 transition-all cursor-pointer"
                        >
                          <Play className="w-4 h-4 text-rose-500 rotate-90" />
                        </button>
                        <button
                          onClick={() => handleRemoveSpace(space)}
                          title="Remove from app"
                          className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded text-slate-400 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 select-all font-mono truncate" title={space.name}>
                      {space.name}
                    </p>
                  </div>

                  {/* Card Center: Tag Details */}
                  <div className="flex flex-wrap gap-1.5">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      <Shield className="w-3 h-3 text-blue-500" />
                      Access: {space.config?.accessType || 'TRUSTED'}
                    </div>
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      <Sliders className="w-3 h-3 text-purple-500" />
                      Locks: {space.config?.moderation === 'ON' ? 'Moderated' : 'Unmoderated'}
                    </div>
                  </div>

                  {/* Card Bottom: Big clickable link */}
                  <div className="pt-2 border-t border-slate-100/80">
                    <a
                      href={space.meetingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Launch Google Meet
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
