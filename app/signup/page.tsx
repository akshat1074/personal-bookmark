"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookmarkSimple, GithubLogo, GoogleLogo, ArrowRight, Spinner } from "@phosphor-icons/react";
import { signUpSchema, type SignUpInput } from "@/lib/validations";

export default function SignupPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof SignUpInput | "general", string[]>>>({});

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const parsed = signUpSchema.safeParse(data);
        if (!parsed.success) {
            setErrors(parsed.error.flatten().fieldErrors);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                body: JSON.stringify(parsed.data),
            });

            const result = await res.json();
            if (!res.ok) {
                setErrors(typeof result.error === "object" ? result.error : { general: [result.error] });
                return;
            }

            router.push("/login?signup=success");
        } catch (err) {
            setErrors({ general: ["Something went wrong. Please try again."] });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />

            <div className="w-full max-w-md relative z-10 animate-in">
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="bg-white text-black p-2 rounded-xl mb-6">
                        <BookmarkSimple size={24} weight="bold" />
                    </Link>
                    <h1 className="font-outfit text-3xl font-bold mb-2">Create an account</h1>
                    <p className="text-zinc-500 text-sm">Join the next generation of link management</p>
                </div>

                <div className="glass-dark border border-white/5 p-8 rounded-3xl shadow-2xl">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">NAME</label>
                                <input
                                    name="name"
                                    placeholder="Johnny"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                                    required
                                />
                                {errors.name && <p className="text-[10px] text-red-400 ml-1">{errors.name[0]}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">HANDLE</label>
                                <input
                                    name="handle"
                                    placeholder="johnny"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-zinc-600"
                                    required
                                />
                                {errors.handle && <p className="text-[10px] text-red-400 ml-1">{errors.handle[0]}</p>}
                            </div>
                        </div>

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
                            <label className="text-xs font-semibold text-zinc-400 ml-1">PASSWORD</label>
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
                            {isLoading ? <Spinner size={20} className="animate-spin" /> : "Sign Up"}
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
                    Already have an account?{" "}
                    <Link href="/login" className="text-white hover:underline underline-offset-4">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
