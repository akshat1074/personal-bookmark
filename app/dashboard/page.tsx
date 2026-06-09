"use client";

import { useState, useEffect } from "react";
import { BookmarkCard } from "@/components/BookmarkCard";
import { MagnifyingGlass, Funnel, BookmarkSimple, Spinner } from "@phosphor-icons/react";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    description: string | null;
    faviconUrl: string | null;
    isPublic: boolean;
    createdAt: Date | string;
}

export default function DashboardPage() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchBookmarks();
    }, [search, filter]);

    async function fetchBookmarks() {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append("q", search);
            if (filter !== "all") params.append("filter", filter);

            const res = await fetch(`/api/bookmarks?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setBookmarks(data.bookmarks);
            }
        } catch (err) {
            console.error("Failed to fetch bookmarks:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header / Search */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
                <div>
                    <h1 className="font-outfit text-4xl font-bold mb-2">My Library</h1>
                    <p className="text-zinc-500 text-sm">Organize and rediscover your favorite finds.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <MagnifyingGlass size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 cursor-pointer appearance-none text-zinc-400 hover:text-white transition-colors"
                    >
                        <option value="all">All</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 text-zinc-500 space-y-4">
                    <Spinner size={32} className="animate-spin" />
                    <p className="font-medium text-sm">Loading your collection...</p>
                </div>
            ) : bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in">
                    {bookmarks.map((bookmark) => (
                        <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            onDelete={async (id) => {
                                const ok = confirm("Delete this bookmark?");
                                if (ok) {
                                    await fetch(`/api/bookmarks/${id}`, { method: "DELETE" });
                                    fetchBookmarks();
                                }
                            }}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 rounded-[40px] border border-dashed border-white/5 bg-white/[0.01]">
                    <div className="bg-white/5 p-6 rounded-full mb-6">
                        <BookmarkSimple size={48} weight="thin" className="text-zinc-500" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No bookmarks found</h2>
                    <p className="text-zinc-500 text-sm max-w-xs text-center leading-relaxed">
                        {search ? `We couldn't find anything matching "${search}"` : "Your library is empty. Start saving links to see them here."}
                    </p>
                </div>
            )}
        </div>
    );
}
