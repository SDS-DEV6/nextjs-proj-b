"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Image from "next/image";
import PikuImage from "@/assets/piku-ad.png";

const ResetPassword = ({
  params,
}: {
  params: {
    token: string;
    email: string;
  };
}) => {
  const router = useRouter();
  const token = params.token;
  const mail = params.email;
  const email = decodeURIComponent(mail);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  if (message?.startsWith("Password successfully updated")) {
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Axios for sending the PATCH request
    axios
      .patch("/api/reset/verify", {
        token,
        email,
        newPassword,
      })
      .then((response) => {
        setMessage(response.data.message);
        // Redirect the user or show a success message
        // router.push('/login'); // Uncomment this to redirect after success
      })
      .catch((error) => {
        console.error(
          "Error:",
          error.response ? error.response.data.message : error.message
        );
        setMessage(
          error.response
            ? error.response.data.message
            : "An unexpected error occurred"
        );
      });
  };

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
                      <h1>Enter your new password</h1>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                    />
                    <button type="submit">Reset Password</button>
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

export default ResetPassword;
