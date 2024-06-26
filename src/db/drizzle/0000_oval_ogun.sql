CREATE TABLE IF NOT EXISTS "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar,
	"slug" varchar,
	"content" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
