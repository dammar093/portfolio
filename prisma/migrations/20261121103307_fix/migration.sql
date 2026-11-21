/*
  Warnings:

  - You are about to drop the column `proejct_id` on the `Seo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[project_id]` on the table `Seo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Seo" DROP CONSTRAINT "Seo_proejct_id_fkey";

-- DropIndex
DROP INDEX "Seo_proejct_id_key";

-- AlterTable
ALTER TABLE "Seo" DROP COLUMN "proejct_id",
ADD COLUMN     "project_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Seo_project_id_key" ON "Seo"("project_id");

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
