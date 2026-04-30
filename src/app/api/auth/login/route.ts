import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import { getFirstValidationError, loginSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = loginSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { message: getFirstValidationError(validatedFields.error) },
      { status: 400 },
    );
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );

  const valid = await bcrypt.compare(password, user.password);

  if (!valid)
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );

  const token = signJwt({
    userId: user.id.toString(),
    email: user.email,
  });

  const response = NextResponse.json({
    message: "Login success",
    redirect: "/dashboard",
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
