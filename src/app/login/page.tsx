'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    if (!email.includes("@")) {
      setError("Format email tidak valid.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setIsSubmitting(true);

    document.cookie = "campusrun_role=superadmin; path=/";

    const redirect = searchParams.get("redirect") || "/dashboard";
    setTimeout(() => {
      setIsSubmitting(false);
      router.push(redirect);
    }, 600);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-800 bg-slate-950/80">
          <CardHeader className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-slate-950">
                CR
              </span>
              <span>CampusRun Admin</span>
            </div>
            <CardTitle className="text-lg text-slate-50">
              Masuk ke Dashboard
            </CardTitle>
            <p className="text-sm text-slate-400">
              Gunakan akun admin yang telah terdaftar untuk mengelola
              operasional CampusRun.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="admin@campusrun.com"
                    className="h-10 pl-9"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    className="h-10 pl-9"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
              </div>
              {error && (
                <div className="rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="mt-1 flex h-10 w-full items-center justify-center gap-2 bg-emerald-500 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Memproses..." : "Masuk"}
              </Button>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                Fitur autentikasi akan terhubung ke Supabase Auth atau
                NextAuth.js. Saat ini form ini melakukan simulasi login dan
                mengarahkan ke dashboard.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
