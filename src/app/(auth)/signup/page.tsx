"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupValues } from "@/lib/validations/auth";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: SignupValues) {
    setServerError(null);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { full_name: values.fullName },
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      });

      setIsLoading(false);

      if (error) {
        setServerError(error.message);
        return;
      }

      setIsSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm rounded-panel border border-white/10 bg-white p-8 shadow-soft text-center">
        <h1 className="mb-4 text-2xl font-bold text-ink">Check your email</h1>
        <p className="text-sm text-muted">
          We sent a confirmation link to your email address. Click the link to activate your account.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block text-sm font-semibold text-ink underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-panel border border-white/10 bg-white p-8 shadow-soft">
      <h1 className="mb-6 text-2xl font-bold text-ink">Create an account</h1>

      {serverError && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600" role="alert">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          label="Full name"
          placeholder="Jane Doe"
          error={errors.fullName?.message}
          registration={register("fullName")}
        />
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
        <FormField
          label="Confirm password"
          type="password"
          placeholder="Repeat password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
        />

        <Button type="submit" className="mt-2 w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full"
        onClick={() => setServerError("Google sign-up coming soon")}
      >
        Sign up with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
