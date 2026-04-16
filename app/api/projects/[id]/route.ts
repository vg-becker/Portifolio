export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

// 🔍 GET por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
    });

    return Response.json(project);
  } catch (error) {
    console.error("GET ERROR:", error);
    return new Response("Erro ao buscar projeto", { status: 500 });
  }
}

// ✏️ UPDATE
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: body,
    });

    return Response.json(updated);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return new Response("Erro ao atualizar", { status: 500 });
  }
}

// ❌ DELETE
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await params;

    await prisma.project.delete({
      where: { id: Number(id) },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return new Response("Erro ao deletar", { status: 500 });
  }
}