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
        artistId: id,
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
    const { firstName, lastName, suffix, aboutMe, password, profileUrl } =
      artistData;

    const { id } = params;

    const updateArtist = await prisma.artist.update({
      where: {
        artistId: id,
      },
      data: {
        firstName,
        lastName,
        suffix,
        aboutMe,
        password,
        profileUrl,
      },
    });

    if (!updateArtist) {
      return NextResponse.json(updateArtist);
    }

    return NextResponse.json(updateArtist);
  } catch (err) {
    return NextResponse.json(
      { message: "Error Posting Data to Database", err },
      { status: 500 }
    );
  }
};
