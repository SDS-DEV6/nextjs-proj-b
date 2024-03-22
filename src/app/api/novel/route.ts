import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    const adminData = await prisma.novel.findMany({});
    return NextResponse.json(adminData);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Retrieving Data", err },
      { status: 500 }
    );
  }
};

// novel with volume

export const POST = async (request: { json: () => any }) => {
  try {
    const novelData = await request.json();
    const { genre, title, synopsis, artistId, thumbnailUrl } = novelData;

    // Check if artistId is provided
    if (!artistId) {
      return NextResponse.json(
        { message: "artistId is required" },
        { status: 400 }
      );
    }

    // Check if artistId exists in the artist table
    const artist = await prisma.artist.findUnique({
      where: { artistId: artistId },
    });
    if (!artist) {
      return NextResponse.json(
        { message: "artistId does not exist" },
        { status: 400 }
      );
    }

    // Step 1: Create the novel first.
    const newNovel = await prisma.novel.create({
      data: {
        genre,
        title,
        synopsis,
        artistId,
        thumbnailUrl,
      },
    });

    // Step 2: Use the newNovel.novelId to create a volume for this novel.
    const newVolume = await prisma.volume.create({
      data: {
        title: "",
        novelId: newNovel.novelId, // Now you have the novelId to use here.
      },
    });

    // Step 3: Use the newVolume.volumeId to create a chapter for this volume.
    await prisma.chapter.create({
      data: {
        title: "",
        content: "",
        volumeId: newVolume.volumeId, // Linking the chapter to the newly created volume.
        // Additional fields like `visibility` can be set here if required.
      },
    });

    // If you need to return the novel along with its volumes and chapters,
    // you might need to fetch the novel again with the related volumes and chapters.
    // For simplicity, here we're just returning the new novel's data.
    return NextResponse.json(newNovel);
  } catch (err) {
    console.error("Error creating novel and its components:", err);
    return NextResponse.json(
      { message: "Error Posting Data to Database", err },
      { status: 500 }
    );
  }
};

/* retrieve all novel thru artistID
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Modify the query to include related novels
    const artistWithNovels = await prisma.artist.findUnique({
      where: {
        ArtistId: id,
      },
      include: {
        novels: true,
        volume: true, // Include novels related to the artist
      },
    });

    if (!artistWithNovels) {
      return NextResponse.json(
        { message: "Artist Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(artistWithNovels);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Retrieving Data", err },
      { status: 500 }
    );
  }
};

include: {
        volumes: {
          include: {
            chapters: true,
          },
        },
      },



/* novelroute
export const POST = async (request: { json: () => any }) => {
  try {
    const novelData = await request.json();
    const { genre, title, synopsis, ArtistId, thumbnailUrl } = novelData;

    const newNovel = await prisma.novel.create({
      data: {
        genre,
        title,
        synopsis,
        ArtistId,
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
};  */
