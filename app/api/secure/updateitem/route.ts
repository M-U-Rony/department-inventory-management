import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

const ITEM_TYPES = {
  cpu: { fields: ["name", "brand", "processor", "ram", "ssd", "hdd", "gpu", "status", "note"] },
  monitor: { fields: ["name", "brand", "status", "note"] },
  printer: { fields: ["name", "brand", "status", "note"] },
  ups: { fields: ["name", "status", "note"] },
} as const;

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemType = searchParams.get("item")?.toLowerCase();
  const id = searchParams.get("id");

  if (!itemType || !id) {
    return NextResponse.json(
      { error: "Item type and id are required" },
      { status: 400 }
    );
  }

  if (!(itemType in ITEM_TYPES)) {
    return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
  }

  try {
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return NextResponse.json({ error: "Invalid id format" }, { status: 400 });
    }

    const body = await req.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt, updatedAt, ...data } = body;

    // Remove null desk and location
    if (data.desk === null) delete data.desk;
    if (data.location === null) delete data.location;

    // Filter to only allowed fields
    const allowedFields = ITEM_TYPES[itemType as keyof typeof ITEM_TYPES].fields;
    const dataToUpdate = Object.fromEntries(
      Object.entries(data).filter(([key]) => (allowedFields as readonly string[]).includes(key))
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (prisma as any)[itemType];
    const updatedItem = await model.update({
      where: { id: numId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}
