"use client";

import { BookmarkSimple, DotsThree, Trash, Eye, EyeSlash, ShareNetwork } from "@phosphor-icons/react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Bookmark {
    id: string;
    title: string;
    url: string;
    description: string | null;
    faviconUrl: string | null;
    isPublic: boolean;
    createdAt: Date | string;
}

interface BookmarkCardProps {
    bookmark: Bookmark;
    onEdit?: (bookmark: Bookmark) => void;
    onDelete?: (id: string) => void;
}

export function BookmarkCard({ bookmark, onEdit, onDelete }: BookmarkCardProps) {
    const domain = new URL(bookmark.url).hostname;

    return (
        <div className="glass-dark border border-white/5 p-5 rounded-3xl group hover:border-white/10 hover:bg-white/5 transition-all animate-in flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors">
                        {bookmark.faviconUrl ? (
                            <img src={bookmark.faviconUrl} alt="" className="w-5 h-5" />
                        ) : (
                            <BookmarkSimple size={20} className="text-zinc-500" />
                        )}
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-semibold text-sm truncate group-hover:text-white transition-colors">
                            {bookmark.title}
                        </h3>
                        <p className="text-[10px] text-zinc-500 truncate font-medium uppercase tracking-wider">
                            {domain}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit?.(bookmark)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
                        title="Edit"
                    >
                        <DotsThree size={18} weight="bold" />
                    </button>
                    <button
                        onClick={() => onDelete?.(bookmark.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all"
                        title="Delete"
                    >
                        <Trash size={18} />
                    </button>
                </div>
            </div>

            <p className="text-zinc-400 text-xs line-clamp-2 mb-6 flex-1 leading-relaxed">
                {bookmark.description || "No description provided."}
            </p>

            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500">
                    <span className="flex items-center gap-1">
                        {bookmark.isPublic ? <Eye size={12} weight="fill" className="text-emerald-500" /> : <EyeSlash size={12} weight="fill" />}
                        {bookmark.isPublic ? "Public" : "Private"}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span>{formatDistanceToNow(new Date(bookmark.createdAt))} ago</span>
                </div>

                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold text-white/50 hover:text-white flex items-center gap-1 transition-colors group/link"
                >
                    Open Link
                    <ShareNetwork size={12} className="group-hover/link:translate-x-0.5 transition-transform" />
                </a>
            </div>
        </div>
    );
}
