import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const requestBody = await request.json();
    const { volumeId, title, content } = requestBody;

    if (!volumeId || !title || !content) {
      return NextResponse.json(
        { message: "Incomplete fields" },
        { status: 400 }
      );
    }

    // Retrieve all chapter for the specified volume.
    const existingVolumes = await prisma.chapter.findMany({
      where: {
        volumeId: volumeId,
      },
      orderBy: {
        chapterNumber: "desc", // Order by volumeNumber in descending order to get the highest number first.
      },
    });

    // Determine the chapterNumber for the new volume.
    const newChapterNumber =
      existingVolumes.length > 0 ? existingVolumes[0].chapterNumber + 1 : 1;

    // Create the new chapter with the determined chapterNumber.
    const newChapter = await prisma.chapter.create({
      data: {
        title: title, // Use the title from the request.
        content: content,
        volumeId: volumeId, // Associate this new volume with the novel.
        chapterNumber: newChapterNumber, // Set the correct volume number.
      },
    });

    // Fetch the updated volume data along with all its volumes.
    const updatedVolume = await prisma.volume.findUnique({
      where: { volumeId: volumeId },
      include: {
        chapters: {
          orderBy: {
            chapterNumber: "asc",
          },
        },
      },
    });

    if (!updatedVolume) {
      return NextResponse.json(
        { message: "Volume not found" },
        { status: 404 }
      );
    }

    // Return the updated novel data including the new volume.
    return NextResponse.json(updatedVolume);
  } catch (err) {
    console.error("Error adding volume to novel:", err);
    return NextResponse.json(
      { message: "Error adding volume to novel", err },
      { status: 500 }
    );
  }
};
