"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { profileSchema } from "@/lib/validations/settings";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";

// Input type: avatarUrl is optional because of .default("") in the schema.
// Output type: avatarUrl is always string after zod parses and applies the default.
// useForm<Input, Context, Output> maps TFieldValues to the input shape and
// TTransformedValues to the output shape so the resolver and submit handler agree.
type ProfileInput = z.input<typeof profileSchema>;
type ProfileOutput = z.output<typeof profileSchema>;

interface SettingsFormProps {
  userId: string;
  defaultValues: ProfileOutput;
}

export function SettingsForm({ userId, defaultValues }: SettingsFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput, unknown, ProfileOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(values: ProfileOutput) {
    setServerError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          avatar_url: values.avatarUrl,
        })
        .eq("id", userId);

      setIsLoading(false);

      if (error) {
        setServerError(error.message);
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
      {serverError && (
        <div
          className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
          role="alert"
        >
          {serverError}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Profile updated successfully.
        </div>
      )}

      <FormField
        label="Full name"
        placeholder="Your name"
        error={errors.fullName?.message}
        registration={register("fullName")}
      />
      <FormField
        label="Avatar URL"
        type="url"
        placeholder="https://example.com/avatar.png"
        error={errors.avatarUrl?.message}
        registration={register("avatarUrl")}
      />

      <Button type="submit" className="mt-2 w-full sm:w-auto" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
