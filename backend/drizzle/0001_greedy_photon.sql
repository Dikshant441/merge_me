ALTER TABLE "users" ADD COLUMN "about" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "skills" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "age" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "membership" text DEFAULT 'Free';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_premium" boolean DEFAULT false;