import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {

    const body = await req.text();
    if (!body) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    const { name } = JSON.parse(body);

    // console.log(name)

    if (!name) {
      return NextResponse.json({ message: "Lab name is required" }, { status: 400 });
    }

    const lab = await prisma.lab.create({
      data: { name },
    });

    // Create 60 desks
    const desksData = Array.from({ length: 60 }).map((_, i) => ({
      deskNo: `Desk-${i + 1}`,
      labId: lab.id,
    }));

    const desks = await prisma.desk.createMany({
      data: desksData,
    });

    return NextResponse.json(
      { message: "Lab created successfully", lab, desksCreated: 60 },
      { status: 201 }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error in creating lab";
    return NextResponse.json({ message }, { status: 500 });
  }
}
