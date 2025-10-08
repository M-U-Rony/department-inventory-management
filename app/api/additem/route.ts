import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {

    try {

        const { searchParams } = new URL(req.url);
        const item = searchParams.get("item");

        const body = await req.json();
        const { name, processor, ram, hdd, ssd, gpu, status, note } = body;



        if (!name) {
            return NextResponse.json({ error: "Missing required fields: name, processor, and ram are required." }, { status: 400 });
        }

        if (item == "cpu") {
            
            const newCpu = await prisma.cpu.create({
            data: {
                name,
                processor,
                ram,
                hdd,
                ssd,
                gpu,
                status,
                Note: note,
            },
        });

         return NextResponse.json(newCpu, { status: 201 });
        }
        else{

            if(item == "monitor"){

            const newMonitor = await prisma.monitor.create({
            data: {
                name,
                status,
                Note: note,
            },
        });

         return NextResponse.json(newMonitor, { status: 201 });

        }

        else if(item == "printer"){

            const newPrinter = await prisma.printer.create({
            data: {
                name,
                status,
                Note: note,
            },
        });

         return NextResponse.json(newPrinter, { status: 201 });

           

        }

        else if(item == "ups"){

            const newUps = await prisma.ups.create({
            data: {
                name,
                status,
                Note: note,
            },
        });

         return NextResponse.json(newUps, { status: 201 });
        }

        else{
            return NextResponse.json({ error: "Invalid item type" }, { status: 400 });
        }

       

       
    }} catch (error) {
        console.error("Error creating new CPU:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}  