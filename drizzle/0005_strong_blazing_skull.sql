ALTER TABLE "reservations" RENAME COLUMN "approved_at" TO "picked_up_at";--> statement-breakpoint
ALTER TABLE "reservations" RENAME COLUMN "approved_by" TO "picked_up_by";--> statement-breakpoint
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_approved_by_users_id_user_fk";
--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."reservation_status_enum";--> statement-breakpoint
CREATE TYPE "public"."reservation_status_enum" AS ENUM('pending', 'picked_up', 'rejected', 'expired', 'completed', 'cancelled');--> statement-breakpoint
ALTER TABLE "reservations" ALTER COLUMN "status" SET DATA TYPE "public"."reservation_status_enum" USING "status"::"public"."reservation_status_enum";--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_picked_up_by_users_id_user_fk" FOREIGN KEY ("picked_up_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;