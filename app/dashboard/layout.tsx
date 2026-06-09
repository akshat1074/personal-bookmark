"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    BookmarkSimple,
    House,
    User,
    Gear,
    Plus,
    SignOut,
    MagnifyingGlass,
    ArrowSquareOut
} from "@phosphor-icons/react";
import { CreateBookmarkDialog } from "@/components/CreateBookmarkDialog";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [userData, setUserData] = useState<{ handle: string; name: string } | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data.user);
                }
            } catch (err) {
                console.error("Failed to fetch user:", err);
            }
        }
        fetchUser();
    }, []);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    }

    const navItems = [
        { name: "My Library", icon: House, href: "/dashboard", active: pathname === "/dashboard" },
        { name: "Public Profile", icon: User, href: `/${userData?.handle || "me"}`, active: false },
        { name: "Settings", icon: Gear, href: "/dashboard/settings", active: pathname === "/dashboard/settings" },
    ];

    return (
        <div className="flex h-screen bg-[#0A0A0B] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col p-6 glass-dark relative z-50">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-white text-black p-1.5 rounded-lg">
                        <BookmarkSimple size={20} weight="bold" />
                    </div>
                    <span className="font-outfit font-bold text-xl tracking-tight">Bookmarks</span>
                </div>

                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black h-11 rounded-2xl font-bold mb-8 hover:bg-zinc-200 transition-all active:scale-[0.98]"
                >
                    <Plus size={18} weight="bold" />
                    New Bookmark
                </button>

                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${item.active
                                ? "bg-white/10 text-white font-semibold"
                                : "text-zinc-500 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={20} weight={item.active ? "fill" : "regular"} className={item.active ? "text-white" : "group-hover:text-white"} />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                            {userData?.name?.[0] || "A"}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{userData?.name || "Member"}</p>
                            <p className="text-[10px] text-zinc-500 truncate">@{userData?.handle || "user"}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-zinc-500 hover:text-red-400 hover:bg-red-400/5 transition-all group"
                    >
                        <SignOut size={20} />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative scroll-smooth">
                <header className="sticky top-0 z-40 h-20 px-8 flex items-center justify-between pointer-events-none">
                    {/* Space for absolute elements if needed */}
                </header>

                <div className="px-8 pb-12 pt-4">
                    {children}
                </div>
            </main>

            {isCreateOpen && (
                <CreateBookmarkDialog
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={() => {
                        setIsCreateOpen(false);
                        router.refresh(); // Trigger server data re-fetch
                    }}
                />
            )}
        </div>
    );
}
