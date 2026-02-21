DROP INDEX "reservations_type_idx";--> statement-breakpoint
ALTER TABLE "reservations" DROP COLUMN "reservation_type";--> statement-breakpoint
DROP TYPE "public"."reservation_type_enum";