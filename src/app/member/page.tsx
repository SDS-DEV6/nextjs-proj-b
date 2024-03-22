"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ShowArtist from "@/components/artist/showArtist";
import AddNovel from "@/components/novel/addNovel";
import { logout } from "@/actions/auth";
import ListNovels from "@/components/artistWorks/listNovels";

function Main() {
  const { data: session, status } = useSession();
  //const [data, setData] = useState(null);

  const [artistData, setArtistData] = useState(null);
  const [novelData, setNovelData] = useState(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      if (session?.user?.ID) {
        try {
          const res = await fetch(
            `http://localhost:3000/api/artistData/${session.user.ID}`,
            {
              cache: "no-cache",
            }
          );
          if (!res.ok) {
            throw new Error("Failed to fetch artist data");
          }
          const jsonData = await res.json();
          setArtistData(jsonData);
        } catch (error) {
          console.error("Failed to fetch artist data:", error);
        }
      }
    };

    const fetchNovelData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/novel`, {
          cache: "no-cache",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch novel data");
        }
        const jsonData = await res.json();
        setNovelData(jsonData);
      } catch (error) {
        console.error("Failed to fetch novel data:", error);
      }
    };

    fetchArtistData();
    fetchNovelData();
  }, [session?.user?.ID]); // Empty dependency array ensures this only runs once on mount

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>You need to be logged in.</div>;
  }

  return (
    <>
      <div>
        <div className="my-5 flex flex-col gap-4">
          <AddNovel />
          {artistData && <ShowArtist artists={artistData} />}
        </div>
        {novelData && (
          <ListNovels novels={novelData} artistId={session.user.ID} />
        )}

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
