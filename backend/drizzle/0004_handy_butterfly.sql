CREATE TABLE "saved_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"saved_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "no_self_save" CHECK ("saved_profiles"."user_id" <> "saved_profiles"."saved_user_id")
);
--> statement-breakpoint
ALTER TABLE "saved_profiles" ADD CONSTRAINT "saved_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_profiles" ADD CONSTRAINT "saved_profiles_saved_user_id_users_id_fk" FOREIGN KEY ("saved_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_saved_pair" ON "saved_profiles" USING btree ("user_id","saved_user_id");--> statement-breakpoint
CREATE INDEX "idx_saved_user_created" ON "saved_profiles" USING btree ("user_id","created_at");