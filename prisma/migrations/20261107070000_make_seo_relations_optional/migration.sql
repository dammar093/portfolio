-- An SEO record belongs to one content type, so the other relation columns must be nullable.
ALTER TABLE "Seo"
  ALTER COLUMN "page_id" DROP NOT NULL,
  ALTER COLUMN "setting_id" DROP NOT NULL,
  ALTER COLUMN "blog_id" DROP NOT NULL;
