import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";
import {
  getFirstValidationError,
  registerRequestSchema,
} from "@/lib/validations/auth";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = registerRequestSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json(
      { message: getFirstValidationError(validatedFields.error) },
      { status: 400 },
    );
  }

  const { name, email, password } = validatedFields.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "Email already used" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  const token = signJwt({
    userId: user.id.toString(),
    email: user.email,
  });

  const response = NextResponse.json({
    message: "Register success",
    user: { id: user.id.toString(), name: user.name, email: user.email },
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
