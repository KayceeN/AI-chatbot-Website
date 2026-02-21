import { createClient } from "@supabase/supabase-js";
import { embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { landingContent } from "../../content/landing";

// Direct client creation — this runs as a standalone script, not in Next.js.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface SeedEntry {
  title: string;
  content: string;
}

function extractEntries(): SeedEntry[] {
  const entries: SeedEntry[] = [];

  // Company overview
  entries.push({
    title: "About kAyphI",
    content: `${landingContent.brand} — ${landingContent.hero.subtitle}. ${landingContent.hero.quote}`,
  });

  // Services
  for (const card of landingContent.services.cards) {
    entries.push({
      title: `Service: ${card.title}`,
      content: card.body,
    });
  }

  // Pricing plans
  for (const plan of landingContent.pricing.plans) {
    entries.push({
      title: `Pricing: ${plan.name} Plan`,
      content: `${plan.blurb}. Monthly: ${plan.monthly}. Yearly: ${plan.yearly}. Features: ${plan.features.join(", ")}.`,
    });
  }

  // Process steps
  for (const step of landingContent.process.steps) {
    entries.push({
      title: `Process Step ${step.id}: ${step.title}`,
      content: step.body,
    });
  }

  // FAQ
  for (const faq of landingContent.faq.entries) {
    entries.push({
      title: `FAQ: ${faq.question}`,
      content: faq.answer,
    });
  }

  // Case studies
  for (const study of landingContent.projects.caseStudies) {
    const metrics = study.metrics.map((m) => `${m.value} ${m.label}`).join(", ");
    entries.push({
      title: `Case Study: ${study.title}`,
      content: `${study.body} Results: ${metrics}.`,
    });
  }

  // Comparison
  entries.push({
    title: "Why Choose kAyphI Over Competitors",
    content: `kAyphI offers: ${landingContent.comparison.us.features.join(", ")}. Unlike competitors who rely on: ${landingContent.comparison.others.features.join(", ")}.`,
  });

  // Contact info
  const emailCard = landingContent.contact.infoCards.find((c) => c.title === "Email");
  if (emailCard) {
    entries.push({
      title: "Contact Information",
      content: `${emailCard.body} Email: ${emailCard.linkLabel}`,
    });
  }

  return entries;
}

async function seed() {
  const ownerId = process.env.KAYPHI_OWNER_USER_ID;
  if (!ownerId) {
    console.error("KAYPHI_OWNER_USER_ID is required");
    process.exit(1);
  }

  const entries = extractEntries();
  console.log(`Extracted ${entries.length} entries from landing content`);

  // Generate embeddings in batch
  console.log("Generating embeddings...");
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: entries.map((e) => `${e.title}\n${e.content}`),
  });

  // Insert into knowledge_base
  console.log("Inserting into knowledge_base...");
  const rows = entries.map((entry, i) => ({
    user_id: ownerId,
    type: "text" as const,
    title: entry.title,
    content: entry.content,
    embedding: JSON.stringify(embeddings[i]),
    metadata: {},
  }));

  const { error } = await supabase.from("knowledge_base").insert(rows);

  if (error) {
    console.error("Insert error:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} knowledge base entries`);
}

seed();
