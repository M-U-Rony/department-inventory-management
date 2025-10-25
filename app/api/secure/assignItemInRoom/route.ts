import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";


export async function POST(req: Request) {

    const {category,roomId} = await req.json();

    console.log(category,roomId)

    if(category === 'desk'){

        const newDesk = await prisma.desk.create({

            data: {
                deskNo: "",
                roomId: roomId,
            }
        })

        return NextResponse.json({ message: "Desk created", deskId: newDesk.id }, { status: 201 })
    }

    // No creation for printer/bookshelf/almari here; those are created via additem route

    return NextResponse.json({ error: "Unsupported category" }, { status: 400 })

   
}