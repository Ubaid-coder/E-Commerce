"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Lock, Camera, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProfile, updateProfile } from "@/services/profile.service";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserProfile {
  name: string;
  email: string;
  avator?: string;
}

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  // Controlled form values
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [avator, setavator] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        const data = await response.data;


        const user = data;
        setProfile(user);
        setUsername(user.name || "");
        setUseremail(user.email || "");
        setavator(user.avator || "");

      } catch (error) {
        console.error("Failed to load user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        name: username,
        email: useremail,
        avator: avator
      };

      const response = await updateProfile(payload);

      const data = await response.data;

      toast.success("Account details saved successfully!");
      router.push("/")

    } catch (error) {
      toast.error("Failed To change!");
      console.error("Error updating settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePasswordClick = () => {
    // You can replace this with a router push to a password reset page,
    // or trigger an account verification email request.
    alert("Redirecting to password security manager...");
    // router.push("/auth/change-password");
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
        <span className="text-sm font-medium text-slate-500">Loading your profile parameters...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 px-4 py-6 font-sans">
      {/* Profile Welcome Branding Panel */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm flex flex-col sm:flex-row items-center gap-5">
        <div className="relative h-20 w-20 rounded-full border-2 border-emerald-500/30 bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
          {avator ? (
            <img src={avator} alt="User avator" className="h-full w-full object-cover" />
          ) : (
            <User className="h-10 w-10 text-slate-400" />
          )}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <span className="text-emerald-400 text-[10px] font-bold tracking-widest uppercase block">Personal Center</span>
          <h1 className="text-xl font-bold tracking-tight">{profile?.name || "Member Account"}</h1>
          <p className="text-slate-400 text-xs font-medium">Update your account authentication details and avator assets down below.</p>
        </div>
      </div>

      {/* Profile Modification Sheet Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-5">

        {/* Username Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-slate-400" />
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. janesmith"
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
          />
        </div>

        {/* User Email Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            User Email Address
          </label>
          <input
            type="email"
            required
            value={useremail}
            onChange={(e) => setUseremail(e.target.value)}
            placeholder="jane@example.com"
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900"
          />
        </div>

        {/* avator Image Destination URL Target */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-slate-400" />
            avator Image URL
          </label>
          <input
            type="url"
            value={avator}
            onChange={(e) => setavator(e.target.value)}
            placeholder="https://images.unsplash.com/your-avator-link..."
            className="w-full px-4 py-2.5 text-sm border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 font-mono"
          />
        </div>

        {/* Security Parameters / Change Password Button Wrapper */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-400" />
              Security Access
            </span>
            <p className="text-xs text-slate-400 font-medium">Manage or cycle your active login password keys.</p>
          </div>
          <Button
            type="button"
            onClick={handleChangePasswordClick}
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 h-10 px-4 self-start sm:self-auto"
          >
            Change Password
          </Button>
        </div>

        {/* Save/Commit Profile Action Layout Trigger */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <Button
            type="submit"
            disabled={saving}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 px-6 gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

      </form>
    </div>
  );
}