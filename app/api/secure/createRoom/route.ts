import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.text();
    if (!body) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    const { name} = JSON.parse(body);

    // console.log(name);

    if (!name) {
      return NextResponse.json({ message: "Room name is required" }, { status: 400 });
    }

    const lab = await prisma.room.create({
      data: { name},
    });


    return NextResponse.json(
      { message: "Room created successfully" },
      { status: 201 }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error in creating Room";
    return NextResponse.json({ message }, { status: 500 });
  }
}
