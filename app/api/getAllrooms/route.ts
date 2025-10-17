import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

// need lab in ascending order

export async function GET() {
    try {
        const labs = await prisma.lab.findMany(
            {
                orderBy: {
                    id: "asc"
                },
            }
        );

        return NextResponse.json(labs, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error in GET /api/getAllrooms";
        return NextResponse.json({ message }, { status: 500 });
    }
}