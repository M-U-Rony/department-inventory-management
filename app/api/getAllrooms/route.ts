import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET() {
    try {
        const labs = await prisma.lab.findMany();

        return NextResponse.json(labs, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error in GET /api/getAllrooms";
        return NextResponse.json({ message }, { status: 500 });
    }
}