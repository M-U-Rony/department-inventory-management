import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const item = searchParams.get("item");
    const id = searchParams.get("id");

    if (!item || !id) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const itemId = Number(id);

    let result;
    switch (item.toLowerCase()) {
      case "printer":
        result = await prisma.printer.update({ where: { id: itemId }, data: { room: { disconnect: true } } });
        break;
      case "almari":
        result = await prisma.almari.update({ where: { id: itemId }, data: { room: { disconnect: true } } });
        break;
      case "bookshelf":
        result = await prisma.bookshelf.update({ where: { id: itemId }, data: { room: { disconnect: true } } });
        break;
      default:
        return NextResponse.json({ message: "Invalid item type" }, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error on withdrawing room item";
    return NextResponse.json({ message }, { status: 500 });
  }
}
