import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const verified = verifyJwt(token);

  if (!verified || typeof verified === "string") {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: BigInt(verified.userId) },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id.toString(),
    name: user.name,
    email: user.email,
  });
}
