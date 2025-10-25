/*
  Warnings:

  - You are about to drop the column `location` on the `Printer` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Ups` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upsId]` on the table `Desk` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Desk" DROP CONSTRAINT "Desk_labId_fkey";

-- AlterTable
ALTER TABLE "public"."Desk" ADD COLUMN     "roomId" INTEGER,
ADD COLUMN     "upsId" INTEGER,
ALTER COLUMN "labId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Printer" DROP COLUMN "location",
ADD COLUMN     "roomId" INTEGER;

-- AlterTable
ALTER TABLE "public"."Ups" DROP COLUMN "location";

-- CreateTable
CREATE TABLE "public"."Almari" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'working',
    "Note" TEXT,
    "roomId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Almari_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bookshelf" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'working',
    "roomId" INTEGER,
    "Note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookshelf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Room_name_key" ON "public"."Room"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Desk_upsId_key" ON "public"."Desk"("upsId");

-- AddForeignKey
ALTER TABLE "public"."Printer" ADD CONSTRAINT "Printer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."Lab"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_upsId_fkey" FOREIGN KEY ("upsId") REFERENCES "public"."Ups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Almari" ADD CONSTRAINT "Almari_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bookshelf" ADD CONSTRAINT "Bookshelf_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "public"."Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;
