import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-4 py-12">
      <Link href="/" className="mb-8">
        <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-white">
          <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <span className="absolute h-2.5 w-2.5 -translate-x-[5px] rotate-45 rounded-sm bg-ink" />
            <span className="absolute h-2.5 w-2.5 translate-x-[5px] rotate-45 rounded-sm bg-ink" />
          </span>
          <span className="text-[2rem] leading-none sm:text-[2.1rem]">
            <span>k</span>
            <span className="brand-letter-a">A</span>
            <span>yph</span>
            <span className="brand-letter-i">I</span>
          </span>
        </span>
      </Link>
      {children}
    </div>
  );
}
