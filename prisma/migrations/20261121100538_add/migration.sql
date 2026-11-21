/*
  Warnings:

  - A unique constraint covering the columns `[proejct_id]` on the table `Seo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SeoType" ADD VALUE 'Project';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seo" ADD COLUMN     "proejct_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seo_proejct_id_key" ON "Seo"("proejct_id");

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_proejct_id_fkey" FOREIGN KEY ("proejct_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
