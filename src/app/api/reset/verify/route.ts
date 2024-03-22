import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import bcryptjs from "bcryptjs";

export const PATCH = async (request: NextRequest) => {
  // Ensure the request is a PATCH request
  if (request.method !== "PATCH") {
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }
  const jsonData = await request.json();
  const { token, email, newPassword } = jsonData;

  // Ensure email, token, and newPassword are provided
  if (!email || !token || !newPassword) {
    return new NextResponse(
      JSON.stringify({
        message: "Email, token, and new password are required.",
      }),
      { status: 400 }
    );
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: { email: email },
    });

    if (
      !artist ||
      artist.passwordResetToken !== token ||
      !artist.passwordResetExpires ||
      new Date() > new Date(artist.passwordResetExpires)
    ) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or expired token." }),
        { status: 400 }
      );
    }

    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcryptjs.hash(newPassword, saltRounds);

    await prisma.artist.update({
      where: { email: email },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Password successfully updated." })
    );
  } catch (error) {
    console.error("Error updating password:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error updating password." }),
      { status: 500 }
    );
  }
};
