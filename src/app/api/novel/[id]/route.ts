import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    // Modify the query to include related novels
    const novelWithVolumes = await prisma.novel.findUnique({
      where: {
        novelId: id,
      },
      include: {
        volumes: {
          include: {
            chapters: true,
          },
        },
      },
    });

    if (!novelWithVolumes) {
      return NextResponse.json({ message: "Novel Not Found" }, { status: 404 });
    }

    return NextResponse.json(novelWithVolumes);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Retrieving Data", err },
      { status: 500 }
    );
  }
};

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const novelData = await request.json();
    const { title, synopsis, genre, thumbnailUrl } = novelData;

    const { id } = params;

    const updateNovel = await prisma.novel.update({
      where: {
        novelId: id,
      },
      data: {
        title,
        synopsis,
        genre,
        thumbnailUrl,
      },
    });

    if (!updateNovel) {
      return NextResponse.json(updateNovel);
    }

    return NextResponse.json(updateNovel);
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

    //find novel volumes
    const volumes = await prisma.volume.findMany({
      where: {
        novelId: id,
      },
    });

    //delete volume chapters
    for (const volume of volumes) {
      await prisma.chapter.deleteMany({
        where: {
          volumeId: volume.volumeId,
        },
      });
    }

    //delete volume
    await prisma.volume.deleteMany({
      where: {
        novelId: id,
      },
    });

    //delete novel
    const deleteNovel = await prisma.novel.deleteMany({
      where: {
        novelId: id,
      },
    });

    //error check
    if (!deleteNovel) {
      return NextResponse.json(
        { message: "Failed to Delete Novel" },
        { status: 404 }
      );
    }

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
