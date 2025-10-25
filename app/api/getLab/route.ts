import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const item = searchParams.get("name");

    console.log("Fetching labs with name:", item);

    const labs = await prisma.lab.findFirst({
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
      },
    });

    // console.log("Fetched labs:", labs);

    return NextResponse.json(
      {
        desks: labs?.desks || [],
        layout: labs?.layout || "layout1",
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Internal Server Error on fetching labs";
    return NextResponse.json({ message }, { status: 500 });
  }
}
