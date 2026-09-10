/*
  Warnings:

  - Added the required column `testimonial` to the `Testimonial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seo" ALTER COLUMN "keywords" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "testimonial" TEXT NOT NULL;
