import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const item = searchParams.get("name");

    const room = await prisma.room.findFirst({
      where: item ? { name: item } : {},
      include: {
        desks: {
          include: {
            cpu: true,
            monitor: true,
            ups: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        almari: {},
        printers: {},
        bookshelf: {}
      },
    });

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error on fetching labs";
    return NextResponse.json({ message }, { status: 500 });
  }
}
