import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const item = searchParams.get("item");
        const id = searchParams.get("id");
        const deskId = searchParams.get("deskId");

        if (!item || !id || !deskId) {
            return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
        }

        let result;
        const itemId = Number(id);
        const deskIdNum = Number(deskId);

        // Update the appropriate item type based on the item parameter
        switch (item.toLowerCase()) {
            case "cpu":
                result = await prisma.cpu.update({
                    where: { id: itemId },
                    data: { desk: { connect: { id: deskIdNum } } },
                });
                break;
            case "monitor":
                result = await prisma.monitor.update({
                    where: { id: itemId },
                    data: { desk: { connect: { id: deskIdNum } } },
                });
                break;
            default:
                return NextResponse.json({ message: "Invalid item type" }, { status: 400 });
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal Server Error on assigning item";
        return NextResponse.json({ message }, { status: 500 });
    }
}