import { embed } from "ai";
import { openai } from "@/lib/openai/client";
import { createClient } from "@/lib/supabase/server";
import {
  createKBEntrySchema,
  updateKBEntrySchema,
  deleteKBEntrySchema,
} from "@/lib/validations/knowledge";

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("knowledge_base")
    .select("id, title, content, type, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("type", "text")
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function POST(req: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = createKBEntrySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: `${parsed.data.title}\n${parsed.data.content}`,
  });

  const { data, error } = await supabase
    .from("knowledge_base")
    .insert({
      user_id: user.id,
      type: "text",
      title: parsed.data.title,
      content: parsed.data.content,
      embedding: JSON.stringify(embedding),
    })
    .select("id, title, content, created_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = updateKBEntrySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) updates.title = parsed.data.title;
  if (parsed.data.content !== undefined) updates.content = parsed.data.content;

  if (parsed.data.content !== undefined || parsed.data.title !== undefined) {
    const { data: current } = await supabase
      .from("knowledge_base")
      .select("title, content")
      .eq("id", parsed.data.id)
      .eq("user_id", user.id)
      .single();

    if (current) {
      const title = parsed.data.title ?? current.title;
      const content = parsed.data.content ?? current.content;
      const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: `${title}\n${content}`,
      });
      updates.embedding = JSON.stringify(embedding);
    }
  }

  const { data, error } = await supabase
    .from("knowledge_base")
    .update(updates)
    .eq("id", parsed.data.id)
    .eq("user_id", user.id)
    .select("id, title, content, updated_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data);
}

export async function DELETE(req: Request) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const parsed = deleteKBEntrySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { error } = await supabase
    .from("knowledge_base")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
