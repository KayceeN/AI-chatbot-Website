"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues, safeRedirect } from "@/lib/validations/auth";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginValues) {
    setServerError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setServerError(error.message);
        setIsLoading(false);
        return;
      }

      const next = safeRedirect(searchParams.get("next"));
      router.push(next);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-panel border border-white/10 bg-white p-8 shadow-soft">
      <h1 className="mb-6 text-2xl font-bold text-ink">Log in</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          registration={register("email")}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          registration={register("password")}
        />

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => setServerError("Google sign-in coming soon")}
      >
        Sign in with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-semibold text-ink underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
