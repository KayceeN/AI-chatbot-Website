import Link from "next/link";

interface FloatingDockProps {
  primary: string;
  secondary: string;
}

export const FloatingDock = ({ primary, secondary }: FloatingDockProps) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Link
        href="#"
        className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white shadow-button transition-transform hover:-translate-y-0.5"
      >
        ⌘ {primary}
      </Link>
      <span className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-ink shadow-plate">⚑ {secondary}</span>
    </div>
  );
};
