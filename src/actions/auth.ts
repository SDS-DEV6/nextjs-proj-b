"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db";
import type { Artist } from "@prisma/client";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import { randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { EmailNotVerifiedError } from "@/errors";
import { UserNotVerifiedError } from "@/errors";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await isUserEmailVerifiedAndStatusVerified(
      formData.get("email") as string,
      true
    );
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }

    if (
      error instanceof EmailNotVerifiedError ||
      error instanceof UserNotVerifiedError
    ) {
      return error?.message;
    }

    throw error;
  }
}

const signUpSchema = z.object({
  name: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(3).max(255),
});

interface SignUpFormState {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    _form?: string[];
  };
}

export async function signUp(
  formState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const result = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const isEmailExists = await findUserByEmail(result.data.email);

  if (isEmailExists) {
    return {
      errors: {
        email: ["Email already exists"],
      },
    };
  }

  const isUsernameExists = await findUserByUsername(result.data.name);

  if (isUsernameExists) {
    return {
      errors: {
        name: ["Username already exists"],
      },
    };
  }

  const hashed = await generatePasswordHash(result.data.password);

  const verificationToken = generateEmailVerificationToken();

  let user: Artist;
  try {
    user = await db.artist.create({
      data: {
        username: result.data.name,
        email: result.data.email,
        password: hashed,
        emailVerifyToken: verificationToken,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong"],
        },
      };
    }
  }

  await sendVerificationEmail(result.data.email, verificationToken);

  redirect(
    `/helpers/verifyEmail/verify/send?email=${result.data.email}&verification_sent=1`
  );
}

export async function logout() {
  return await signOut();
}

export const findUserByEmail = async (email: string) => {
  return await db.artist.findFirst({
    where: {
      email,
    },
  });
};

export const findUserByUsername = async (username: string) => {
  return await db.artist.findFirst({
    where: {
      username,
    },
  });
};

const generatePasswordHash = async (password: string) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

const generateEmailVerificationToken = () => {
  return randomBytes(32).toString("hex");
};

const sendVerificationEmail = async (email: string, token: string) => {
  const emailData = {
    from: "noreply-verification@pinyastudio.com",
    to: email,
    subject: "Pinya.io: Artist Email Verification",
    html: `
        <p>Hi there, you've recently signed up as an artist for Pinya.io inorder to get 
        started with your application please confirm your email by clicking on the link below.</p>
        <br>
        <a href="http://localhost:3000/helpers/verifyEmail/verify?email=${email}&token=${token}">Verify Email</a>
        <br>
        If this was a mistake, please ignore this email.
        </p>
    `,
  };

  try {
    await transporter.sendMail(emailData);
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export const resendVerificationEmail = async (email: string) => {
  const emailVerificationToken = generateEmailVerificationToken();

  try {
    await db.artist.update({
      where: { email },
      data: { emailVerifyToken: emailVerificationToken },
    });

    await sendVerificationEmail(email, emailVerificationToken);
  } catch (error) {
    return "Something went wrong.";
  }

  return "";
};

export const verifyEmail = (email: string) => {
  return db.artist.update({
    where: { email },
    data: {
      emailVerifiedAt: new Date(),
      emailVerifyToken: null,
      emailVerified: true,
    },
  });
};

export const isUserEmailVerifiedAndStatusVerified = async (
  email: string,
  verifiedStatus: boolean
) => {
  const user = await db.artist.findFirst({
    where: { email },
  });

  if (!user) return true;

  if (!user?.emailVerifiedAt) {
    throw new EmailNotVerifiedError(`EMAIL_NOT_VERIFIED:${email}`);
  }

  if (!user?.verifiedStatus) {
    throw new UserNotVerifiedError(`APPLICATION_NOT_APPROVED`);
  }

  return true;
};
