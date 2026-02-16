import { Mail, Phone } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import type { LandingPageContent } from "@/content/landing";

interface ContactSectionProps {
  content: LandingPageContent["contact"];
}

const contactIcons: Record<string, React.ReactNode> = {
  Email: <Mail className="h-5 w-5" />,
  Call: <Phone className="h-5 w-5" />,
};

export const ContactSection = ({ content }: ContactSectionProps) => {
  return (
    <SectionShell id="contact">
      <SectionHeading
        badge={content.badge}
        title={content.title}
        subtitle={content.subtitle}
        icon={<Phone className="h-3.5 w-3.5" />}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.15fr]">
        <div className="grid gap-5">
          {content.infoCards.map((card) => (
            <GlassCard key={card.title}>
              <p className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-button">
                {contactIcons[card.title] ?? <Mail className="h-5 w-5" />}
              </p>
              <p className="mb-4 text-lg text-muted">{card.body}</p>
              <a href={card.linkHref} className="text-lg font-semibold text-ink underline">
                {card.linkLabel}
              </a>
            </GlassCard>
          ))}
        </div>

        <GlassCard>
          <form className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-ink">
              {content.form.fullName}
              <input className="field" placeholder={content.form.placeholders.fullName} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              {content.form.email}
              <input className="field" placeholder={content.form.placeholders.email} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              {content.form.subject}
              <input className="field" placeholder={content.form.placeholders.subject} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-ink">
              {content.form.message}
              <textarea className="field min-h-28 resize-none" placeholder={content.form.placeholders.message} />
            </label>
            <button type="submit" className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white shadow-button">
              {content.form.submit}
            </button>
          </form>
        </GlassCard>
      </div>
    </SectionShell>
  );
};
