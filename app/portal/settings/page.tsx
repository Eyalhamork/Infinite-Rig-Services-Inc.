"use client";

import { useState, useEffect, useRef } from "react";
import {
    User,
    Mail,
    Phone,
    Building2,
    Save,
    Camera,
    Check,
    CheckCircle,
    XCircle,
    Loader2,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "sonner";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    company_name: string;
    avatar_url: string;
    role: string;
}

export default function PortalSettingsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async () => {
        if (!profile) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: profile.full_name,
                    phone: profile.phone,
                    company_name: profile.company_name,
                })
                .eq("id", profile.id);

            if (error) throw error;

            setSaved(true);
            toast.success("Profile updated!", {
                description: "Your changes have been saved.",
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
            });
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile", {
                description: "Please try again.",
                icon: <XCircle className="w-5 h-5 text-red-500" />,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !profile) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image must be less than 2MB");
            return;
        }

        setUploadingAvatar(true);
        try {
            const fileExt = file.name.split(".").pop();
            const filePath = `avatars/${profile.id}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("public")
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("public")
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from("profiles")
                .update({ avatar_url: urlData.publicUrl })
                .eq("id", profile.id);

            if (updateError) throw updateError;

            setProfile({ ...profile, avatar_url: urlData.publicUrl });
            toast.success("Avatar updated!");
        } catch (error: any) {
            console.error("Error uploading avatar:", error);
            toast.error("Failed to upload avatar", { description: error.message });
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-600">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>

                {/* Avatar */}
                {profile && (
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name}
                                    className="w-20 h-20 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#B8860B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {profile.full_name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2) || "?"}
                                </div>
                            )}
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                            >
                                {uploadingAvatar ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Camera className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{profile.full_name}</p>
                            <p className="text-sm text-gray-500">Client Account</p>
                        </div>
                    </div>
                )}

                {/* Form */}
                {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={profile.full_name || ""}
                                    onChange={(e) =>
                                        setProfile({ ...profile, full_name: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={profile.email || ""}
                                    disabled
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="tel"
                                    value={profile.phone || ""}
                                    onChange={(e) =>
                                        setProfile({ ...profile, phone: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                                    placeholder="+1 XXX XXX XXXX"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={profile.company_name || ""}
                                    onChange={(e) =>
                                        setProfile({ ...profile, company_name: e.target.value })
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                        onClick={saveProfile}
                        disabled={saving}
                        className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#FF6B35] text-white rounded-lg hover:bg-[#e55a2b] transition-colors disabled:opacity-50"
                    >
                        {saved ? (
                            <>
                                <Check className="h-5 w-5" />
                                <span>Saved!</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>{saving ? "Saving..." : "Save Changes"}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Account Type</span>
                        <span className="font-medium text-gray-900">Client</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Account Status</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            Active
                        </span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span className="text-gray-500">Need Help?</span>
                        <a href="/contact" className="text-[#FF6B35] hover:underline font-medium">
                            Contact Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
