"use client";

import Link from "next/link";
import Image from "next/image";
import PikuImage from "@/assets/piku-ad.png";

export default function ApplicationPending() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center flex-col h-full w-full p-10 bg-white">
          <div className="flex flex-col justify-center items-center">
            <Image src={PikuImage} width={197} height={159} alt="Piku-ad" />
            <div className="bg-slate-50 p-6 border rounded-2xl font-quicksand text-blackberry-300">
              <div>
                <div className="flex flex-col items-center justify-center">
                  <div className="text-2xl font-extrabold font-raleway">
                    <div className="mb-4">
                      <h2>
                        {" "}
                        Thank you for applying to Pinya.io! We're reviewing your
                        application and will be in touch via email with updates.
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Link href="/" className="bg-white py-3 px-2 rounded">
                    Back
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
