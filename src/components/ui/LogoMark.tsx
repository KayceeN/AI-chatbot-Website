export const LogoMark = () => {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-ink">
      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-ink">
        <span className="absolute h-2.5 w-2.5 -translate-x-[5px] rotate-45 rounded-sm bg-white" />
        <span className="absolute h-2.5 w-2.5 translate-x-[5px] rotate-45 rounded-sm bg-white" />
      </span>
      <span className="text-[2rem] leading-none sm:text-[2.1rem]" aria-label="kAyphI">
        <span>k</span>
        <span className="brand-letter-a">A</span>
        <span>yph</span>
        <span className="brand-letter-i">I</span>
      </span>
    </span>
  );
};
