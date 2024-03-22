import Form from "@/components/email/verify/send/form";
import { Suspense } from "react";

import Image from "next/image";
import PikuImage from "@/assets/piku-ad.png";

export default function Send() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center flex-col h-full w-full p-10 bg-white">
        <div className="flex flex-col justify-center items-center">
          <Image src={PikuImage} width={197} height={159} alt="Piku-ad" />
          <div className="bg-slate-50 p-6 border rounded-2xl font-quicksand text-blackberry-300">
            <div>
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-extrabold font-raleway">
                  Email Verification Required
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Suspense>
                  <Form />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
