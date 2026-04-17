import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// ✏️ UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const updated = await prisma.project.update({
      where: { id: Number(id) },
      data: body,
    });

    return Response.json(updated);
  } catch (error) {
    console.error("PUT ERROR:", error);
    return new Response("Erro ao atualizar", { status: 500 });
  }
}

// ❌ DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await context.params;

    await prisma.project.delete({
      where: { id: Number(id) },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return new Response("Erro ao deletar", { status: 500 });
  }
}