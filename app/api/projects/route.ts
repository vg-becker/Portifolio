import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



// ✅ GET (público)
export async function GET() {
  const projects = await prisma.project.findMany();
  return Response.json(projects);
}

// 🔒 POST (protegido)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const project = await prisma.project.create({
    data: body,
  });

  return Response.json(project);
}