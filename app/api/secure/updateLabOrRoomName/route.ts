import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, category } = body;

        if (!id || !name) {
            return NextResponse.json({ message: "ID and name are required" }, { status: 400 });
        }

        if (!name.trim()) {
            return NextResponse.json({ message: "Name cannot be empty" }, { status: 400 });
        }

        console.log("Updating lab/room with ID:", id, "to name:", name);

        if(category == 'lab'){

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
        } else{

             const existingRoom = await prisma.room.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!existingRoom) {
                return NextResponse.json({ message: "Room not found" }, { status: 404 });
            }
    
            const updatedRoom = await prisma.room.update({
                where: { id: parseInt(id) },
                data: { name: name.trim() },
            });
    
            console.log("Room updated successfully:", updatedRoom);
    
            return NextResponse.json(
                { message: "Room name updated successfully", lab: updatedRoom },
                { status: 200 }
            );


        }

        

    } catch (error) {
        console.error("Error updating name:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error updating  name";
        return NextResponse.json({ message }, { status: 500 });
    }
}