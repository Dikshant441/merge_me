CREATE TYPE "public"."connection_status" AS ENUM('ignored', 'interested', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "connection_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"status" "connection_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "no_self_request" CHECK ("connection_requests"."from_user_id" <> "connection_requests"."to_user_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "legacy_mongo_id" varchar(24);--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_requests" ADD CONSTRAINT "connection_requests_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "one_per_direction" ON "connection_requests" USING btree ("from_user_id","to_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_pair" ON "connection_requests" USING btree (LEAST("from_user_id", "to_user_id"),GREATEST("from_user_id", "to_user_id"));--> statement-breakpoint
CREATE INDEX "idx_cr_to_status" ON "connection_requests" USING btree ("to_user_id","status");--> statement-breakpoint
CREATE INDEX "idx_cr_from_status" ON "connection_requests" USING btree ("from_user_id","status");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_legacy_mongo_id_unique" UNIQUE("legacy_mongo_id");