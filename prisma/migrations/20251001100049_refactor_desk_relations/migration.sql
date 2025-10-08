/*
  Warnings:

  - You are about to drop the column `Status` on the `Cpu` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Cpu` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Printer` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Ups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Cpu" DROP COLUMN "Status",
DROP COLUMN "location",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'working';

-- AlterTable
ALTER TABLE "public"."Monitor" DROP COLUMN "Status",
DROP COLUMN "location",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'working';

-- AlterTable
ALTER TABLE "public"."Printer" DROP COLUMN "Status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'working';

-- AlterTable
ALTER TABLE "public"."Ups" DROP COLUMN "Status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'working';

-- CreateTable
CREATE TABLE "public"."Desk" (
    "id" SERIAL NOT NULL,
    "deskNo" TEXT NOT NULL,
    "labNo" TEXT NOT NULL,
    "cpuId" INTEGER,
    "monitorId" INTEGER,
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Desk_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Desk_cpuId_key" ON "public"."Desk"("cpuId");

-- CreateIndex
CREATE UNIQUE INDEX "Desk_monitorId_key" ON "public"."Desk"("monitorId");

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_cpuId_fkey" FOREIGN KEY ("cpuId") REFERENCES "public"."Cpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "public"."Monitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
