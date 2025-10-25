import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Missing desk id" }, { status: 400 });
    }
    const deskId = Number(id);
    await prisma.desk.delete({ where: { id: deskId } });
    return NextResponse.json({ message: "Desk deleted" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete desk";
    return NextResponse.json({ message }, { status: 500 });
  }
}
