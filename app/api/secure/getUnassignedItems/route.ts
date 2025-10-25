import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {

        const { searchParams } = new URL(req.url);
        const item = searchParams.get("item");


        if(item === "monitor") {

           const unassignedItems = await prisma.monitor.findMany({
                where: { desk: null }
            });

            return NextResponse.json(unassignedItems, { status: 200 });
        }
        else if(item === "cpu") {

            const unassignedItems = await prisma.cpu.findMany({
                where: { desk: null }
            });

            return NextResponse.json(unassignedItems, { status: 200 });
        }
        else if(item === "ups") {

            const unassignedItems = await prisma.ups.findMany({
                where: { desk: null }
            });

            return NextResponse.json(unassignedItems, { status: 200 });
        }

        else if(item === "almari") {

            const unassignedItems = await prisma.almari.findMany({});

            return NextResponse.json(unassignedItems, { status: 200 });
        }

        else if(item === "printer") {

            const unassignedItems = await prisma.printer.findMany({});

            return NextResponse.json(unassignedItems, { status: 200 });
        }

        return NextResponse.json( { message: "Invalid item type" }, { status: 400 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error on fetching unassigned items";
        return NextResponse.json({ message }, { status: 500 });
    }
}