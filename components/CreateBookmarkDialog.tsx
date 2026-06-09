"use client";

import { useState } from "react";
import { X, Plus, Spinner, LinkSimple, TextT, TextAlignLeft, Eye, EyeSlash } from "@phosphor-icons/react";
import { bookmarkSchema, type BookmarkInput } from "@/lib/validations";

interface CreateBookmarkDialogProps {
    onSuccess: () => void;
    onClose: () => void;
}

export function CreateBookmarkDialog({ onSuccess, onClose }: CreateBookmarkDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof BookmarkInput | "general", string[]>>>({});

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = {
            url: formData.get("url"),
            title: formData.get("title"),
            description: formData.get("description"),
            isPublic: isPublic,
        };

        const parsed = bookmarkSchema.safeParse(data);
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
            });

            if (!res.ok) {
                const result = await res.json();
                setErrors({ general: [result.error || "Failed to create bookmark"] });
                return;
            }

            onSuccess();
            onClose();
        } catch (err) {
            setErrors({ general: ["Something went wrong. Please try again."] });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative glass-dark border border-white/10 w-full max-w-lg rounded-[32px] p-8 shadow-2xl animate-in">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-white text-black p-2 rounded-xl">
                            <Plus size={20} weight="bold" />
                        </div>
                        <h2 className="font-outfit text-2xl font-bold">New Bookmark</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 ml-1">
                            <LinkSimple size={14} /> URL
                        </label>
                        <input
                            name="url"
                            placeholder="https://example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700"
                            required
                        />
                        {errors.url && <p className="text-[10px] text-red-500 ml-1">{errors.url[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 ml-1">
                            <TextT size={14} /> TITLE
                        </label>
                        <input
                            name="title"
                            placeholder="My favorite website"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700"
                            required
                        />
                        {errors.title && <p className="text-[10px] text-red-500 ml-1">{errors.title[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 ml-1">
                            <TextAlignLeft size={14} /> DESCRIPTION (OPTIONAL)
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="A few words about this link..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-700 resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isPublic ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-400"} transition-colors`}>
                                {isPublic ? <Eye size={20} weight="fill" /> : <EyeSlash size={20} weight="fill" />}
                            </div>
                            <div>
                                <p className="text-sm font-bold">{isPublic ? "Public Bookmark" : "Private Bookmark"}</p>
                                <p className="text-[10px] text-zinc-500">Visible to everyone with your handle</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsPublic(!isPublic)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${isPublic ? "bg-white" : "bg-zinc-800"}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${isPublic ? "right-1 bg-black" : "left-1 bg-zinc-600"}`} />
                        </button>
                    </div>

                    {errors.general && <p className="text-xs text-red-500 text-center">{errors.general[0]}</p>}

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-[2] h-12 rounded-2xl font-bold text-sm bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Spinner size={20} className="animate-spin" /> : "Save Bookmark"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
