/*
  Warnings:

  - The values [Project] on the enum `SeoType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SeoType_new" AS ENUM ('PAGE', 'SETTING', 'BLOG', 'PROJECT');
ALTER TABLE "Seo" ALTER COLUMN "seo_type" TYPE "SeoType_new" USING ("seo_type"::text::"SeoType_new");
ALTER TYPE "SeoType" RENAME TO "SeoType_old";
ALTER TYPE "SeoType_new" RENAME TO "SeoType";
DROP TYPE "public"."SeoType_old";
COMMIT;
