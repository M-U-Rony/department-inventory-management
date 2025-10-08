/*
  Warnings:

  - Added the required column `deskNo` to the `Desk` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labId` to the `Desk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Desk" ADD COLUMN     "deskNo" TEXT NOT NULL,
ADD COLUMN     "labId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Desk" ADD CONSTRAINT "Desk_labId_fkey" FOREIGN KEY ("labId") REFERENCES "public"."Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
