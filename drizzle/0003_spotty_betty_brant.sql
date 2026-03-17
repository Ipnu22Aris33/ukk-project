ALTER TABLE "books" RENAME COLUMN "stock" TO "total_stock";--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "available_stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "reserved_stock" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "loaned_stock" integer DEFAULT 0 NOT NULL;