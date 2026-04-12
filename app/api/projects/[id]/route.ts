export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


// ✅ GET (público)
export async function GET() {
  try {
    const projects = await prisma.project.findMany();
    return Response.json(projects);
  } catch (error) {
    console.error("GET ERROR:", error);
    return new Response("Erro ao buscar projetos", { status: 500 });
  }
}

// 🔒 POST (protegido)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const project = await prisma.project.create({
      data: body,
    });

    return Response.json(project);
  } catch (error) {
    console.error("POST ERROR:", error);
    return new Response("Erro ao criar projeto", { status: 500 });
  }
}
