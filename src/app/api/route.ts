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
