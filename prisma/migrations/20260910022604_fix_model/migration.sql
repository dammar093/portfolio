/*
  Warnings:

  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `ProjectLanguage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "SeoType" AS ENUM ('PAGE', 'SETTING', 'BLOG');

-- AlterTable
ALTER TABLE "Language" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProjectLanguage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';

-- DropTable
DROP TABLE "Settings";

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL DEFAULT '550e8400-e29b-41d4-a716-446655440000',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "g_tag" TEXT,
    "address" TEXT NOT NULL,
    "linkedin_link" TEXT,
    "github_link" TEXT,
    "youtube_link" TEXT,
    "facebook_link" TEXT,
    "instagram_link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seo" (
    "id" TEXT NOT NULL,
    "og_ttile" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "og_description" TEXT NOT NULL,
    "og_image" TEXT,
    "keywords" TEXT NOT NULL,
    "schema_markup" JSONB,
    "seo_type" "SeoType" NOT NULL,
    "page_id" TEXT NOT NULL,
    "setting_id" TEXT NOT NULL,
    "blog_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "position" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Setting_id_idx" ON "Setting"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_id_idx" ON "Page"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_slug_key" ON "Seo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_page_id_key" ON "Seo"("page_id");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_setting_id_key" ON "Seo"("setting_id");

-- CreateIndex
CREATE UNIQUE INDEX "Seo_blog_id_key" ON "Seo"("blog_id");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_key" ON "Blog"("slug");

-- CreateIndex
CREATE INDEX "Language_id_idx" ON "Language"("id");

-- CreateIndex
CREATE INDEX "Project_id_idx" ON "Project"("id");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_setting_id_fkey" FOREIGN KEY ("setting_id") REFERENCES "Setting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seo" ADD CONSTRAINT "Seo_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
