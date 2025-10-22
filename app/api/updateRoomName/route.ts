import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const item = searchParams.get("name");
    
        console.log("Fetching labs with name:", item);

        const labs = await prisma.lab.findFirst({
            where: item ? { name: item } : {},
            include: {
                desks: {
                include: {
                    cpu: true,
                    monitor: true,
                },
                orderBy: {
                    id: "asc", // fetch desks in ascending order
                },
                },
            },
            });


        // console.log("Fetched labs:", labs);

        return NextResponse.json(labs?.desks, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error on fetching labs";
    return NextResponse.json({ message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name } = body;

        if (!id || !name) {
            return NextResponse.json({ message: "Lab ID and name are required" }, { status: 400 });
        }

        if (!name.trim()) {
            return NextResponse.json({ message: "Lab name cannot be empty" }, { status: 400 });
        }

        console.log("Updating lab with ID:", id, "to name:", name);

        // Check if lab exists
        const existingLab = await prisma.lab.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existingLab) {
            return NextResponse.json({ message: "Lab not found" }, { status: 404 });
        }

        // Update the lab name
        const updatedLab = await prisma.lab.update({
            where: { id: parseInt(id) },
            data: { name: name.trim() },
        });

        console.log("Lab updated successfully:", updatedLab);

        return NextResponse.json(
            { message: "Lab name updated successfully", lab: updatedLab },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error updating lab name:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error updating lab name";
        return NextResponse.json({ message }, { status: 500 });
    }
}