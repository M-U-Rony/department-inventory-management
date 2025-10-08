import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);
        const item = searchParams.get("item");

        let unassignedItems = [];

        if(item === "monitor") {

            unassignedItems = await prisma.monitor.findMany({
                where: { desk: null }
            });
        }
        else if(item === "cpu") {

            unassignedItems = await prisma.cpu.findMany({
                where: { desk: null }
            });
        }

        

        return NextResponse.json(unassignedItems, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching labs:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}