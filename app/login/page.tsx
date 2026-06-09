"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookmarkSimple, GithubLogo, GoogleLogo, ArrowRight, Spinner, CheckCircle } from "@phosphor-icons/react";
import { loginSchema, type LoginInput } from "@/lib/validations";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSignupSuccess = searchParams.get("signup") === "success";

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof LoginInput | "general", string[]>>>({});

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const parsed = loginSchema.safeParse(data);
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(parsed.data),
            });

            const result = await res.json();
            if (!res.ok) {
                setErrors({ general: [result.error || "Invalid credentials"] });
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setErrors({ general: ["Something went wrong. Please try again."] });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md relative z-10 animate-in">
            <div className="flex flex-col items-center mb-10">
                <Link href="/" className="bg-white text-black p-2 rounded-xl mb-6">
                    <BookmarkSimple size={24} weight="bold" />
                </Link>
                <h1 className="font-outfit text-3xl font-bold mb-2">Welcome back</h1>
                <p className="text-zinc-500 text-sm">Elevate your bookmarking experience</p>
            </div>

            {isSignupSuccess && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400 text-sm animate-in">
                    <CheckCircle size={20} weight="fill" />
                    Account created! Please check your email to verify and then sign in.
                </div>
            )}

            <div className="glass-dark border border-white/5 p-8 rounded-3xl shadow-2xl">
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 ml-1">EMAIL</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="hello@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                            required
                        />
                        {errors.email && <p className="text-[10px] text-red-400 ml-1">{errors.email[0]}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-semibold text-zinc-400">PASSWORD</label>
                            <Link href="/forgot-password" className="text-[10px] text-zinc-500 hover:text-white transition-colors">Forgot?</Link>
                        </div>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                            required
                        />
                        {errors.password && <p className="text-[10px] text-red-400 ml-1">{errors.password[0]}</p>}
                    </div>

                    {errors.general && <p className="text-xs text-red-400 text-center">{errors.general[0]}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-white text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all active:scale-[0.98] mt-6 disabled:opacity-50"
                    >
                        {isLoading ? <Spinner size={20} className="animate-spin" /> : "Sign In"}
                        {!isLoading && <ArrowRight size={18} weight="bold" />}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/5"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#141416] px-2 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="h-11 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/5 transition-all">
                        <GoogleLogo size={20} />
                        Google
                    </button>
                    <button className="h-11 rounded-xl border border-white/10 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white/5 transition-all">
                        <GithubLogo size={20} />
                        GitHub
                    </button>
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-zinc-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-white hover:underline underline-offset-4">Sign up</Link>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

            <Suspense fallback={<Spinner size={32} className="animate-spin text-zinc-500" />}>
                <LoginContent />
            </Suspense>
        </div>
    );
}

