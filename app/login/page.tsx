"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const d = await res.json();
      setError(d.error || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%"><defs><pattern id="p" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/>
        </pattern></defs><rect width="100%" height="100%" fill="url(#p)"/></svg>
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Image src="/cla-logo.png" alt="CLA" width={72} height={72} className="object-contain mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-white/40 text-xs mt-1 uppercase tracking-[0.2em]">Cecilia Learning Academy</p>
        </div>
        <div className="bg-white shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-0.5 bg-crimson" />
            <Lock size={14} className="text-crimson" />
            <h2 className="font-display text-lg font-bold text-navy-dark">Sign In</h2>
          </div>
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 mb-5">
              <AlertCircle size={14} /> {error}
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@cecilialearningacademy.com.ng"
                className="w-full border border-silver/40 px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-1.5">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-silver/40 px-3 py-2.5 text-sm focus:outline-none focus:border-navy" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-crimson text-white font-bold py-3 text-sm uppercase tracking-wider hover:bg-crimson-dark transition-colors disabled:opacity-60 mt-2">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          <Image src="/jk-logo.png" alt="JK Technology" width={14} height={14} className="object-contain invert opacity-25" />
          <p className="text-white/25 text-[10px] uppercase tracking-wider">Powered by JK Technology Limited · School Desk</p>
        </div>
      </div>
    </div>
  );
}
