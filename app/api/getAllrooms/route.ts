import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const labs = await prisma.lab.findMany();

        return NextResponse.json(labs, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching labs:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}