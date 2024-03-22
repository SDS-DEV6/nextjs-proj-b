import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const artistData = await prisma.artist.findMany({});
    return NextResponse.json(artistData);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Retrieving Data", err },
      { status: 500 }
    );
  }
};

export const POST = async (request: { json: () => any }) => {
  try {
    const novelData = await request.json();
    const { genre, title, synopsis, artistId, thumbnailUrl } = novelData;

    const newNovel = await prisma.novel.create({
      data: {
        genre,
        title,
        synopsis,
        artistId,
        thumbnailUrl,
      },
    });
    return NextResponse.json(newNovel);
  } catch (err) {
    console.error("Error creating novel:", err);
    return NextResponse.json(
      { message: "Error Posting Data to Database", err },
      { status: 500 }
    );
  }
};
