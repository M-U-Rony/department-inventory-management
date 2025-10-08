import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const item = searchParams.get("item");
        const id = searchParams.get("id");

        if (!item || !id) {
            return NextResponse.json({ error: "Item/id not specified" }, { status: 400 });
        }

        const model = item.toLowerCase();

        switch (model) {
            case "cpu":
                await prisma.cpu.delete({
                    where: { id: parseInt(id, 10) },
                });
                break;
            case "monitor":
                await prisma.monitor.delete({
                    where: { id: parseInt(id, 10) },
                });
                break;
            case "printer":
                await prisma.printer.delete({
                    where: { id: parseInt(id, 10) },
                });
                break;
            case "ups":
                await prisma.ups.delete({
                    where: { id: parseInt(id, 10) },
                });
                break;
            default:
                return NextResponse.json({ error: "Invalid item type or id" }, { status: 400 });
        }

        return NextResponse.json({ message: "Item deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
