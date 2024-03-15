"use client";

import Link from "next/link";
import { signUp } from "@/actions/auth";
import { useFormState } from "react-dom";
import SignupButton from "./signup-button";

import Image from "next/image";
import PikuImage from "../../assets/piku-ad.png";

export default function Form() {
  const [formState, action] = useFormState(signUp, {
    errors: {},
  });

  return (
    <div className="flex items-center flex-col h-full w-full p-10 bg-white">
      <div className="flex flex-col justify-center items-center">
        <Image src={PikuImage} width={197} height={159} alt="Piku-ad" />
        <div className="bg-slate-50 p-6 border rounded-2xl font-quicksand text-blackberry-300">
          <div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-2xl font-extrabold font-raleway">
                Create an Account
              </div>
              <div className="flex flex-row  items-center justify-center gap-2 mt-2">
                <div className="font-inter font-normal">
                  Already have an account?
                </div>
                <Link href="/login">Log in</Link>
              </div>
            </div>
            <div>
              <form action={action} className="mt-4">
                <div className="mb-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-700 text-sm font-bold mb-2 mt-3"
                    >
                      Name
                    </label>
                    <input
                      className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      name="name"
                      defaultValue=""
                    />
                  </div>
                  {/* Displaying name errors if any */}
                  {formState?.errors.name && (
                    <div className="text-sm text-red-500">
                      {formState.errors.name.join(", ")}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-700 text-sm font-bold mb-2 mt-3"
                    >
                      Email
                    </label>
                    <input
                      className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      name="email"
                      defaultValue=""
                    />
                  </div>
                  {/* Displaying email errors if any */}
                  {formState?.errors.email && (
                    <div className="text-sm text-red-500">
                      {formState.errors.email.join(", ")}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-gray-700 text-sm font-bold mb-2 mt-3"
                    >
                      Password
                    </label>
                    <input
                      className="shadow-sm appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="********"
                      name="password"
                      defaultValue=""
                    />
                  </div>
                  {/* Displaying password errors if any */}
                  {formState?.errors.password && (
                    <div className="text-sm text-red-500">
                      {formState.errors.password.join(", ")}
                    </div>
                  )}

                  <div className="absolute insert-y-0 right-0 pr-3 flex items-center text-sm leading-5"></div>

                  <SignupButton />
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="justify-center break-normal mt-3 text-center">
          {" "}
          By continuing, you agree to our <br />
          <Link href="/terms-of-service" className="hover-link">
            Terms of Service{" "}
          </Link>
          and
          <Link href="/privacy-policy" className="hover-link">
            {" "}
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
