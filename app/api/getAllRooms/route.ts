import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const labs = await prisma.room.findMany(
            {
                orderBy: {
                    id: "asc"
                },
            }
        );

        return NextResponse.json(labs, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error in GET /api/getAllRooms";
        return NextResponse.json({ message }, { status: 500 });
    }
}