ALTER TABLE "posts" ALTER COLUMN "content" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "image" varchar;--> statement-breakpoint
ALTER TABLE "posts" ADD COLUMN "subtitle" varchar NOT NULL;