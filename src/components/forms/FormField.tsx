"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegisterReturn } from "react-hook-form";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: UseFormRegisterReturn;
}

export function FormField({
  label,
  type = "text",
  placeholder,
  error,
  registration,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={registration.name} className="text-sm font-semibold text-ink">
        {label}
      </Label>
      <Input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${registration.name}-error` : undefined}
        {...registration}
      />
      {error && (
        <p id={`${registration.name}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
