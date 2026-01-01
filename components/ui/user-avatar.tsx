"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    user: {
        full_name: string;
        email?: string;
        avatar_url?: string;
        role: string;
    } | null;
    className?: string; // For container size
    imageClassName?: string; // For explicit image styling if needed
}

export function UserAvatar({ user, className, imageClassName }: UserAvatarProps) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (!user) return;
        setHasError(false);

        // 1. Prioritize database avatar_url
        if (user.avatar_url) {
            setImgSrc(user.avatar_url);
            return;
        }

        // 2. If internal staff (not client), try local image by first name
        const internalRoles = ['super_admin', 'management', 'editor', 'support', 'staff'];
        // Note: 'client' role is excluded
        if (internalRoles.includes(user.role)) {
            const firstName = user.full_name?.split(" ")[0];
            if (firstName) {
                // Try exact first name png
                setImgSrc(`/images/${firstName}.png`);
            }
        } else {
            setImgSrc(null); // Fallback to initials for clients without avatar_url
        }
    }, [user]);

    if (!user) {
        return (
            <div className={cn("w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center", className)}>
                <User className="w-1/2 h-1/2 text-gray-400" />
            </div>
        );
    }

    const initials = user.full_name
        ? user.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "?";

    // Determine background color based on logic or default
    // Defaulting to the navy blue used in dashboards for initals
    const fallbackBg = "bg-[#004E89]";

    if (imgSrc && !hasError) {
        return (
            <div className={cn("w-10 h-10 relative rounded-full overflow-hidden bg-gray-100", className)}>
                <img
                    src={imgSrc}
                    alt={user.full_name}
                    className={cn("w-full h-full object-cover", imageClassName)}
                    onError={() => setHasError(true)}
                />
            </div>
        );
    }

    return (
        <div
            className={cn(`${fallbackBg} w-10 h-10 text-white rounded-full flex items-center justify-center font-semibold text-sm shrink-0`, className)}
        >
            {initials}
        </div>
    );
}
