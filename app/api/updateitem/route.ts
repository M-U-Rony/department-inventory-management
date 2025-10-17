import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemType = searchParams.get("item")?.toLowerCase();
  const id = searchParams.get("id");
  const body = await req.json();
  const { id: _id, createdAt, updatedAt, ...data } = body;

  // Normalize client payload to Prisma schema field names
  const normalized: Record<string, any> = { ...data };
  if ("note" in normalized) {
    normalized.Note = normalized.note;
    delete normalized.note;
  }

  if ("desk" in normalized && normalized.desk === null) {
    delete normalized.desk;
  }
  if ("location" in normalized && normalized.location === null) {
    delete normalized.location;
  }


  if (!itemType || !id) {
    return NextResponse.json(
      { error: "Item type and id are required" },
      { status: 400 }
    );
  }

  try {
    // Whitelist fields per model to avoid Prisma errors from invalid keys
    const pick = (obj: Record<string, any>, keys: string[]) =>
      Object.fromEntries(Object.entries(obj).filter(([k]) => keys.includes(k)));

    let updatedItem;
    if (itemType === "cpu") {
      const allowed = [
        "name",
        "brand",
        "processor",
        "ram",
        "ssd",
        "hdd",
        "gpu",
        "status",
        "Note",
      ];
      updatedItem = await prisma.cpu.update({
        where: { id: parseInt(id) },
        data: pick(normalized, allowed),
      });
    } else if (itemType === "monitor") {
      const allowed = ["name", "brand", "status", "Note"];
      updatedItem = await prisma.monitor.update({
        where: { id: parseInt(id) },
        data: pick(normalized, allowed),
      });
    } else if (itemType === "printer") {
      const allowed = ["name", "brand", "location", "status", "Note"];
      updatedItem = await prisma.printer.update({
        where: { id: parseInt(id) },
        data: pick(normalized, allowed),
      });
    } else if (itemType === "ups") {
      const allowed = ["name", "location", "status", "Note"];
      updatedItem = await prisma.ups.update({
        where: { id: parseInt(id) },
        data: pick(normalized, allowed),
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
