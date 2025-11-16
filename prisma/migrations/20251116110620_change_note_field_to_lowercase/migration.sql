/*
  Warnings:

  - You are about to drop the column `Note` on the `Almari` table. All the data in the column will be lost.
  - You are about to drop the column `Note` on the `Bookshelf` table. All the data in the column will be lost.
  - You are about to drop the column `Note` on the `Cpu` table. All the data in the column will be lost.
  - You are about to drop the column `Note` on the `Monitor` table. All the data in the column will be lost.
  - You are about to drop the column `Note` on the `Printer` table. All the data in the column will be lost.
  - You are about to drop the column `Note` on the `Ups` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Almari" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."Bookshelf" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."Cpu" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."Monitor" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."Printer" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."Ups" DROP COLUMN "Note",
ADD COLUMN     "note" TEXT;
