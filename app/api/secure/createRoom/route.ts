import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const body = await req.text();
    if (!body) {
      return NextResponse.json({ message: "Request body is empty" }, { status: 400 });
    }

    const { name, layout, rows } = JSON.parse(body);

    console.log(name, layout, rows);

    if (!name || !layout || !rows) {
      return NextResponse.json({ message: "Lab name is required" }, { status: 400 });
    }

    const lab = await prisma.lab.create({
      data: { name, layout },
    });

    const totalDesk = layout == '1' ? 7 * parseInt(rows, 10) : 6 * parseInt(rows, 10);

    // Create desks
    const desksData = Array.from({ length: totalDesk }).map((_, i) => ({
      deskNo: `Desk-${i + 1}`,
      labId: lab.id,
    }));

    const desks = await prisma.desk.createMany({
      data: desksData,
    });

    return NextResponse.json(
      { message: "Lab created successfully" },
      { status: 201 }
    );

  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error in creating lab";
    return NextResponse.json({ message }, { status: 500 });
  }
}
