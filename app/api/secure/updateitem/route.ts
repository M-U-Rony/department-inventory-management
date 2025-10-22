import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const itemType = searchParams.get("item")?.toLowerCase();
  const id = searchParams.get("id");
  const body = await req.json();
  const { id: _id, createdAt, updatedAt, ...data } = body;

  // Normalize client payload to Prisma schema field names
  const normalized: Record<string, unknown> = { ...data };
  if ("note" in normalized) {
    // map client note -> Prisma Note
    (normalized as { Note?: unknown }).Note = (normalized as { note?: unknown }).note;
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
    let updatedItem;
    if (itemType === "cpu") {
      const n = normalized;
      const dataToUpdate: Prisma.CpuUpdateInput = {};
      if (typeof n.name === "string") dataToUpdate.name = n.name;
      if (typeof n.brand === "string") dataToUpdate.brand = n.brand;
      if (typeof n.processor === "string") dataToUpdate.processor = n.processor;
      if (typeof n.ram === "string") dataToUpdate.ram = n.ram;
      if (typeof n.ssd === "string") dataToUpdate.ssd = n.ssd;
      if (typeof n.hdd === "string") dataToUpdate.hdd = n.hdd;
      if (typeof n.gpu === "string") dataToUpdate.gpu = n.gpu;
      if (typeof n.status === "string") dataToUpdate.status = n.status;
      if (typeof (n as { Note?: unknown }).Note === "string") dataToUpdate.Note = (n as { Note?: string }).Note;
      updatedItem = await prisma.cpu.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });
    } else if (itemType === "monitor") {
      const n = normalized;
      const dataToUpdate: Prisma.MonitorUpdateInput = {};
      if (typeof n.name === "string") dataToUpdate.name = n.name;
      if (typeof n.brand === "string") dataToUpdate.brand = n.brand;
      if (typeof n.status === "string") dataToUpdate.status = n.status;
      if (typeof (n as { Note?: unknown }).Note === "string") dataToUpdate.Note = (n as { Note?: string }).Note;
      updatedItem = await prisma.monitor.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });
    } else if (itemType === "printer") {
      const n = normalized;
      const dataToUpdate: Prisma.PrinterUpdateInput = {};
      if (typeof n.name === "string") dataToUpdate.name = n.name;
      if (typeof n.brand === "string") dataToUpdate.brand = n.brand;
      if (typeof n.location === "string") dataToUpdate.location = n.location;
      if (typeof n.status === "string") dataToUpdate.status = n.status;
      if (typeof (n as { Note?: unknown }).Note === "string") dataToUpdate.Note = (n as { Note?: string }).Note;
      updatedItem = await prisma.printer.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });
    } else if (itemType === "ups") {
      const n = normalized;
      const dataToUpdate: Prisma.UpsUpdateInput = {};
      if (typeof n.name === "string") dataToUpdate.name = n.name;
      if (typeof n.location === "string") dataToUpdate.location = n.location;
      if (typeof n.status === "string") dataToUpdate.status = n.status;
      if (typeof (n as { Note?: unknown }).Note === "string") dataToUpdate.Note = (n as { Note?: string }).Note;
      updatedItem = await prisma.ups.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
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
