// password reset for logged in user

import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { sentPasswordResetEmail } from "@/components/email/password-reset/email";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return new NextResponse(JSON.stringify({ message: "Method Not Allowed" }), {
      status: 405,
    });
  }

  const jsonData = await request.json();
  const { email } = jsonData;

  if (!email) {
    return new NextResponse(JSON.stringify({ message: "Email is required." }), {
      status: 400,
    });
  }

  try {
    const artist = await prisma.artist.findUnique({
      where: {
        email: email,
      },
    });

    if (!artist) {
      return new NextResponse(
        JSON.stringify({ message: "Artist not found." }),
        { status: 404 }
      );
    }

    // Check if the artist's verifiedStatus is true
    if (!artist.verifiedStatus) {
      return new NextResponse(
        JSON.stringify({
          message: "Artist is not verified. Password reset is not allowed.",
        }),
        { status: 403 }
      );
    }

    const token = uuidv4();
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.artist.update({
      where: { email: email },
      data: {
        passwordResetToken: token,
        passwordResetExpires: tokenExpiry,
      },
    });

    const resetLink = `http://localhost:3000/member/helper/newPassword/${token}/${email}`;

    await sentPasswordResetEmail({
      to: email,
      subject: "Password Reset Request",
      html: `<p>Greetings, </p>

        <p>Pinya.io has received your password reset request. Please click the button below to set a new password:</p>
        
        <a href="${resetLink}" style="background-color: #007bff; border: none; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 5px;">Reset Password</a>
        
        <p>If you didn't request a password reset, please disregard this message.</p>
        `,
    });

    return new NextResponse(
      JSON.stringify({ message: "Password reset email sent." })
    );
  } catch (error) {
    console.error("Password reset request error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Error processing your request." }),
      { status: 500 }
    );
  }
}
