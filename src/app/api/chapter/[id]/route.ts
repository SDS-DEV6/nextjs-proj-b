import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const chapterData = await request.json();
    const { title, content } = chapterData;

    const { id } = params;

    const updateChapter = await prisma.chapter.update({
      where: {
        chapterId: id,
      },
      data: {
        title,
        content,
      },
    });

    if (!updateChapter) {
      return NextResponse.json(updateChapter);
    }

    return NextResponse.json(updateChapter);
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

    // Once chapters are deleted, delete the volume
    await prisma.chapter.delete({
      where: {
        chapterId: id,
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
