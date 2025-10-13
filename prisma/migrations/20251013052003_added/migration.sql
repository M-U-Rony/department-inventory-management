/*
  Warnings:

  - You are about to drop the column `upsId` on the `Desk` table. All the data in the column will be lost.
  - Added the required column `layout` to the `Lab` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Printer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Desk" DROP CONSTRAINT "Desk_upsId_fkey";

-- DropIndex
DROP INDEX "public"."Desk_upsId_key";

-- AlterTable
ALTER TABLE "public"."Desk" DROP COLUMN "upsId";

-- AlterTable
ALTER TABLE "public"."Lab" ADD COLUMN     "layout" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Monitor" ADD COLUMN     "brand" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Printer" ADD COLUMN     "brand" TEXT NOT NULL;
