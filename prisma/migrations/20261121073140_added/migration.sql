/*
  Warnings:

  - You are about to drop the column `order` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "order",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
