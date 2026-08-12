DROP INDEX "guests_email_key";--> statement-breakpoint
CREATE UNIQUE INDEX "guests_email_key" ON "guests" USING btree ("email");--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_email_lowercase" CHECK ("guests"."email" = lower("guests"."email"));