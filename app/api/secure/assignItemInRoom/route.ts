import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function POST(req: Request) {
    const { category, roomId } = await req.json();

    if (category !== 'desk') {
        return NextResponse.json({ error: "Unsupported category" }, { status: 400 });
    }

    const roomIdNum = Number(roomId);
    if (!roomId || Number.isNaN(roomIdNum)) {
        return NextResponse.json({ error: "roomId is required and must be a number" }, { status: 400 });
    }

    const newDesk = await prisma.desk.create({
        data: {
            deskNo: "",
            roomId: roomIdNum,
        }
    });

    return NextResponse.json({ message: "Desk created", deskId: newDesk.id }, { status: 201 });
}