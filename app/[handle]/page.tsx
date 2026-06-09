"use client";

import { useState, useEffect } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import {
    BookmarkSimple,
    Globe,
    TwitterLogo,
    GithubLogo,
    ArrowLeft,
    Spinner
} from "@phosphor-icons/react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
    const { handle } = useParams();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [handle]);

    async function fetchProfile() {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/${handle}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-zinc-500">
                <Spinner size={32} className="animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-white p-6">
                <div className="bg-white/5 p-6 rounded-full mb-6">
                    <BookmarkSimple size={48} weight="thin" className="text-zinc-500" />
                </div>
                <h1 className="text-2xl font-bold mb-4">User not found</h1>
                <Link href="/" className="text-zinc-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Bookmarks
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] text-white">
            {/* Profile Header */}
            <div className="relative pt-32 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-primary/20 to-transparent blur-[120px] pointer-events-none opacity-40" />

                <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-3xl mb-8 border-4 border-white/5 shadow-2xl overflow-hidden animate-in">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user.name?.[0] || handle?.[0]?.toUpperCase()
                        )}
                    </div>

                    <h1 className="font-outfit text-4xl font-bold mb-3 animate-in [animation-delay:100ms]">{user.name}</h1>
                    <p className="text-zinc-500 font-medium mb-6 animate-in [animation-delay:150ms]">@{user.handle}</p>

                    {user.bio && (
                        <p className="text-zinc-400 text-lg mb-8 max-w-xl leading-relaxed animate-in [animation-delay:200ms]">
                            {user.bio}
                        </p>
                    )}

                    <div className="flex gap-4 animate-in [animation-delay:250ms]">
                        {user.website && (
                            <a href={user.website} target="_blank" rel="noopener" className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                                <Globe size={20} />
                            </a>
                        )}
                        {user.twitter && (
                            <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener" className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                                <TwitterLogo size={20} />
                            </a>
                        )}
                        {user.github && (
                            <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener" className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all text-zinc-400 hover:text-white">
                                <GithubLogo size={20} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Bookmarks Section */}
            <div className="max-w-5xl mx-auto px-6 pb-32">
                <div className="flex items-center gap-2 mb-10 opacity-50">
                    <BookmarkSimple size={18} weight="bold" />
                    <span className="font-outfit font-bold text-sm uppercase tracking-widest">Public Collection</span>
                </div>

                {user.bookmarks?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in [animation-delay:300ms]">
                        {user.bookmarks.map((bookmark: any) => (
                            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 glass-dark rounded-[40px] border border-white/5 animate-in [animation-delay:300ms]">
                        <p className="text-zinc-500 text-sm">This user hasn&apos;t shared any public bookmarks yet.</p>
                    </div>
                )}
            </div>

            <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50">
                <Link href="/" className="glass-dark border border-white/10 px-6 py-3 rounded-full flex items-center gap-3 hover:bg-white/10 transition-all shadow-2xl">
                    <div className="bg-white text-black p-1 rounded-md">
                        <BookmarkSimple size={14} weight="bold" />
                    </div>
                    <span className="text-xs font-bold font-outfit uppercase tracking-wider">Create your own library</span>
                </Link>
            </div>
        </div>
    );
}
