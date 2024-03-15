import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;

    const artistData = await prisma.artist.findUnique({
      where: {
        ArtistId: id,
      },
    });

    if (!artistData) {
      return NextResponse.json(
        { message: "artist Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(artistData);
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
    const artistData = await request.json();
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      profileUrl,
      profileKeyUrl,
    } = artistData;

    const { id } = params;

    const updateartist = await prisma.artist.update({
      where: {
        ArtistId: id,
      },
      data: {
        firstName,
        lastName,
        username,
        email,
        password,
        profileUrl,
        profileKeyUrl,
      },
    });

    if (!updateartist) {
      return NextResponse.json(updateartist);
    }

    return NextResponse.json(updateartist);
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

    // delete
    await prisma.artist.delete({
      where: {
        ArtistId: id,
      },
    });

    return NextResponse.json("artist Data Marked as Deleted");
  } catch (err) {
    return NextResponse.json(
      { message: "Error Deleting Data", err },
      { status: 500 }
    );
  }
};
