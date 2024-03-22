"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { authenticate } from "@/actions/auth";
import LoginButton from "./login-button";
import { redirect, useSearchParams } from "next/navigation";

import PikuImage from "../../assets/piku-ad.png";
import Image from "next/image";

export default function Form() {
  const [formState, action] = useFormState(authenticate, undefined);

  if (formState?.startsWith("EMAIL_NOT_VERIFIED")) {
    redirect(
      `/helpers/verifyEmail/verify/send?email=${formState.split(":")[1]}`
    );
  }

  if (formState?.startsWith("APPLICATION_NOT_APPROVED")) {
    redirect("/helpers/application");
  }

  return (
    <div>
      <div className="flex items-center flex-col h-full w-full p-10 bg-white">
        <div className="flex flex-col justify-center items-center">
          <Image src={PikuImage} width={197} height={159} alt="Piku-ad" />
          <div className="bg-slate-50 p-6 border rounded-2xl font-quicksand text-blackberry-300">
            <div>
              <div className="flex flex-col items-center justify-center text-base">
                <div className="text-2xl font-extrabold font-raleway">
                  Create an Account
                </div>
                <div className="flex flex-row  items-center justify-center gap-2 text-base mt-2">
                  <div className="font-inter font-normal">
                    Don't have an account?
                  </div>
                  <Link href="/signup">Sign Up</Link>
                </div>
              </div>
              <div>
                <form action={action} className="mt-4">
                  <div className="mb-4">
                    <label
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                    />

                    <label
                      className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="peer block w-full rounded-md border border-gray-200 py-[9px] px-3 text-sm outline-2 placeholder:text-gray-500"
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      minLength={6}
                    />

                    {formState && (
                      <div className="text-sm text-red-500">{formState}</div>
                    )}
                  </div>

                  <LoginButton />
                  <div className="mt-4 text-center"></div>

                  <div className="flex flex-row  items-center justify-center gap-2 font-inter text-sm font-medium">
                    <div className="font-inter font-normal">
                      Forgot Password?
                    </div>
                    <Link className="underline" href="/helpers/resetPassword">
                      Reset Password
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
