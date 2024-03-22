import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const volumeData = await request.json();
    const { title } = volumeData;

    const { id } = params;

    const updateVolume = await prisma.volume.update({
      where: {
        volumeId: id,
      },
      data: {
        title,
      },
    });

    if (!updateVolume) {
      return NextResponse.json(updateVolume);
    }

    return NextResponse.json(updateVolume);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Posting Data to Database", err },
      { status: 500 }
    );
  }
};

export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // First, delete all chapters associated with the volumeId
    await prisma.chapter.deleteMany({
      where: {
        volumeId: id,
      },
    });

    // Once chapters are deleted, delete the volume
    await prisma.volume.delete({
      where: {
        volumeId: id,
      },
    });

    // Return a success response

    //if success
    return NextResponse.json(
      { message: "Novel Deleted Successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Error Deleting Novel", err },
      { status: 500 }
    );
  }
};
