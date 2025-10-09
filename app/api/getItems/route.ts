import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const item = searchParams.get("item");

    // console.log("Fetching items of type:", item);

    if (!item) {
        return NextResponse.json({ error: "Item not specified" }, { status: 400 });
    }

    const model = item.toLowerCase();
    let allitems;

    switch (model) {
  case "cpu":
    allitems = await prisma.cpu.findMany({
      orderBy: { id: "asc" },
    });
    break;

  case "monitor":
    allitems = await prisma.monitor.findMany({
      orderBy: { id: "asc" },
    });
    break;

  case "printer":
    allitems = await prisma.printer.findMany({
      orderBy: { id: "asc" },
    });
    break;

  case "ups":
    allitems = await prisma.ups.findMany({
      orderBy: { id: "asc" },
    });
    break;

  case "desk":
    allitems = await prisma.desk.findMany({
      orderBy: { id: "asc" },
    });
    break;

  default:
    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
}


    // console.log(allitems)

    return NextResponse.json(allitems);
}
