import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemType = searchParams.get("item")?.toLowerCase();
  const id = searchParams.get("id");
  const body = await req.json();


  if (!itemType || !id) {
    return NextResponse.json(
      { error: "Item type and id are required" },
      { status: 400 }
    );
  }

  try {
    let updatedItem;
    if (itemType === "cpu") {
      updatedItem = await prisma.cpu.update({
        where: { id: parseInt(id) },
        data: body,
      });
    } else if (itemType === "monitor") {
      updatedItem = await prisma.monitor.update({
        where: { id: parseInt(id) },
        data: body,
      });
    } else if (itemType === "printer") {
      updatedItem = await prisma.printer.update({
        where: { id: parseInt(id) },
        data: body,
      });
    } else if (itemType === "ups") {
      updatedItem = await prisma.ups.update({
        where: { id: parseInt(id) },
        data: body,
      });
    } else {
      return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
