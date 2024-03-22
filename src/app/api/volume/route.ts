import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const requestBody = await request.json();
    const { novelId, title } = requestBody;

    if (!novelId || !title) {
      return NextResponse.json(
        { message: "Novel ID and title are required" },
        { status: 400 }
      );
    }

    // Retrieve all volumes for the specified novel.
    const existingVolumes = await prisma.volume.findMany({
      where: {
        novelId: novelId,
      },
      orderBy: {
        volumeNumber: "desc", // Order by volumeNumber in descending order to get the highest number first.
      },
    });

    // Determine the volumeNumber for the new volume.
    const newVolumeNumber =
      existingVolumes.length > 0 ? existingVolumes[0].volumeNumber + 1 : 1;

    // Create the new volume with the determined volumeNumber.
    const newVolume = await prisma.volume.create({
      data: {
        title: title, // Use the title from the request.
        novelId: novelId, // Associate this new volume with the novel.
        volumeNumber: newVolumeNumber, // Set the correct volume number.
      },
    });

    // Fetch the updated novel data along with all its volumes.
    const updatedNovel = await prisma.novel.findUnique({
      where: { novelId: novelId },
      include: {
        volumes: {
          orderBy: {
            volumeNumber: "asc", // Optionally, order the volumes by volumeNumber.
          },
        }, // Assuming `volumes` is the correct relation name.
      },
    });

    if (!updatedNovel) {
      return NextResponse.json({ message: "Novel not found" }, { status: 404 });
    }

    // Return the updated novel data including the new volume.
    return NextResponse.json(updatedNovel);
  } catch (err) {
    console.error("Error adding volume to novel:", err);
    return NextResponse.json(
      { message: "Error adding volume to novel", err },
      { status: 500 }
    );
  }
};
