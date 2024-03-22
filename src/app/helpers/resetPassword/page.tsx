"use client";

import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PikuImage from "@/assets/piku-ad.png";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState(""); // State to hold the email input
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address.");
      return;
    }
    try {
      const response = await axios.post("/api/reset", { email });
      // Use the response data to set a success message
      setMessage(response.data.message || "Password reset email sent.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error?.response?.data?.message ||
            "An error occurred. Please try again."
        );
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCancel = (e: React.FormEvent) => {
    router.push("/login");
  };

  if (message?.startsWith("Password reset email sent")) {
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center flex-col h-full w-full p-10 bg-white">
          <div className="flex flex-col justify-center items-center">
            <Image src={PikuImage} width={197} height={159} alt="Piku-ad" />
            <div className="bg-slate-50 p-6 border rounded-2xl font-quicksand text-blackberry-300">
              <div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-extrabold font-raleway">
                    <div className="mb-4">
                      <h1>Reset Password</h1>
                    </div>
                  </div>
                  <form onSubmit={handleResetPassword}>
                    {/* Email input field */}
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />

                    <div className=" items-center justify-center">
                      <br />
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Send Reset Link
                      </button>{" "}
                      &nbsp; &nbsp;
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                  <br />
                  {message && <p>{message}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
