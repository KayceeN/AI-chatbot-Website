import type { PropsWithChildren } from "react";

interface SectionShellProps extends PropsWithChildren {
  id?: string;
  className?: string;
}

export const SectionShell = ({ id, className = "", children }: SectionShellProps) => {
  return (
    <section id={id} data-section={id} className={`mx-auto w-full max-w-6xl px-6 py-12 sm:px-8 sm:py-20 ${className}`.trim()}>
      {children}
    </section>
  );
};
