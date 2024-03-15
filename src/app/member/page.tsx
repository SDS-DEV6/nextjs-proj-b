// Mark this file to use client-side rendering capabilities
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ShowArtist from "@/components/showArtist";
import { logout } from "@/actions/auth";

function Main() {
  const { data: session, status } = useSession();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (session?.user?.ID) {
        try {
          const res = await fetch(
            `http://localhost:3000/api/artistData/${session.user.ID}`,
            {
              cache: "no-cache",
            }
          );

          if (!res.ok) {
            throw new Error("Network response was not ok");
          }

          const jsonData = await res.json();
          setData(jsonData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    }

    fetchData();
  }, [session?.user?.ID]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be logged in.</div>;
  }

  const artistDb = data;

  return (
    <>
      {artistDb && <ShowArtist artists={artistDb} />}

      <div>
        <form action={logout}>
          <button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 disabled:bg-slate-50 disabled:text-slate-500">
            Sign Out
          </button>
        </form>
      </div>
    </>
  );
}

export default Main;

/* for reference use
import { useSession } from "next-auth/react";
import { logout } from "@/actions/auth";

export default function Dashboard() {
  const { data: session, status } = useSession();

  return (
    
    <div className="flex flex-col">
      <div className="mb-4">
        <p>Member Area</p>
        <div>
          Signed in as&nbsp;
          {status === "authenticated" ? session?.user?.email : "..."}
          <p>
            <strong>ID:</strong> {session?.user.ID || "ID not available"}
          </p>
          <p>
            <strong>Username:</strong>{" "}
            {session?.user.username || "Username not available"}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {session?.user.email || "Email not available"}
          </p>
        </div>
      </div>
      <form action={logout}>
        <button
          disabled={status === "loading" ? true : false}
          className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 disabled:bg-slate-50 disabled:text-slate-500"
        >
          Sign Out {status === "loading" ? "..." : ""}
        </button>
      </form>
    </div>
  );
}


*/
