/*
  Warnings:

  - You are about to drop the column `labNo` on the `Desk` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `Desk` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upsId]` on the table `Desk` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Desk" DROP COLUMN "labNo",
DROP COLUMN "message",
ADD COLUMN     "upsId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Desk_upsId_key" ON "public"."Desk"("upsId");

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_upsId_fkey" FOREIGN KEY ("upsId") REFERENCES "public"."Ups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
