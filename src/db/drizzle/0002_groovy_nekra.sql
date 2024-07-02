ALTER TABLE "posts" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "content" SET NOT NULL;