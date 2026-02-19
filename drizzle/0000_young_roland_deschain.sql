CREATE TYPE "public"."fine_status_enum" AS ENUM('none', 'paid', 'unpaid');--> statement-breakpoint
CREATE TYPE "public"."loan_status_enum" AS ENUM('borrowed', 'returned', 'late', 'lost');--> statement-breakpoint
CREATE TYPE "public"."reservation_status_enum" AS ENUM('pending', 'approved', 'rejected', 'expired', 'completed', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."reservation_type_enum" AS ENUM('onsite', 'take_home');--> statement-breakpoint
CREATE TYPE "public"."return_condition_enum" AS ENUM('good', 'damaged', 'lost');--> statement-breakpoint
CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'staff', 'member');--> statement-breakpoint
CREATE TABLE "books" (
	"id_book" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) NOT NULL,
	"category_id" integer NOT NULL,
	"publisher" varchar(255),
	"stock" integer NOT NULL,
	"slug" varchar(255) NOT NULL,
	"isbn" varchar(100),
	"year" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id_category" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "loans" (
	"id_loan" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"reservation_id" integer,
	"quantity" integer NOT NULL,
	"loan_date" timestamp NOT NULL,
	"due_date" timestamp NOT NULL,
	"extended_due_date" timestamp,
	"extension_count" integer DEFAULT 0,
	"status" "loan_status_enum" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id_member" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"member_code" varchar(100) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"member_class" varchar(100),
	"address" text,
	"nis" varchar(100),
	"phone" varchar(50),
	"major" varchar(150),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id_reservation" serial PRIMARY KEY NOT NULL,
	"reservation_code" varchar(100) NOT NULL,
	"reservation_type" "reservation_type_enum" NOT NULL,
	"member_id" integer NOT NULL,
	"book_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"status" "reservation_status_enum" NOT NULL,
	"reserved_at" timestamp NOT NULL,
	"approved_at" timestamp,
	"approved_by" integer,
	"expires_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "returns" (
	"id_return" serial PRIMARY KEY NOT NULL,
	"loan_id" integer NOT NULL,
	"returned_at" timestamp NOT NULL,
	"fine_amount" numeric(10, 2),
	"fine_status" "fine_status_enum",
	"condition" "return_condition_enum",
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id_user" serial PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role_enum" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_category_id_categories_id_category_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id_category") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_member_id_members_id_member_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id_member") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_book_id_books_id_book_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id_book") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loans" ADD CONSTRAINT "loans_reservation_id_reservations_id_reservation_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id_reservation") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id_user") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_member_id_members_id_member_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id_member") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_book_id_books_id_book_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id_book") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_approved_by_users_id_user_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "returns" ADD CONSTRAINT "returns_loan_id_loans_id_loan_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id_loan") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "books_slug_unique" ON "books" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "books_isbn_unique" ON "books" USING btree ("isbn");--> statement-breakpoint
CREATE INDEX "books_category_idx" ON "books" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "books_title_idx" ON "books" USING btree ("title");--> statement-breakpoint
CREATE INDEX "books_deleted_at_idx" ON "books" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_slug_unique" ON "categories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "categories_name_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "categories_deleted_at_idx" ON "categories" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "loans_member_idx" ON "loans" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "loans_book_idx" ON "loans" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "loans_status_idx" ON "loans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "loans_due_date_idx" ON "loans" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "loans_deleted_at_idx" ON "loans" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "loans_member_status_idx" ON "loans" USING btree ("member_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "members_user_unique" ON "members" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "members_code_unique" ON "members" USING btree ("member_code");--> statement-breakpoint
CREATE INDEX "members_fullname_idx" ON "members" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "members_deleted_at_idx" ON "members" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reservations_code_unique" ON "reservations" USING btree ("reservation_code");--> statement-breakpoint
CREATE INDEX "reservations_member_idx" ON "reservations" USING btree ("member_id");--> statement-breakpoint
CREATE INDEX "reservations_book_idx" ON "reservations" USING btree ("book_id");--> statement-breakpoint
CREATE INDEX "reservations_status_idx" ON "reservations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reservations_type_idx" ON "reservations" USING btree ("reservation_type");--> statement-breakpoint
CREATE INDEX "reservations_deleted_at_idx" ON "reservations" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX "reservations_member_status_idx" ON "reservations" USING btree ("member_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "returns_loan_unique" ON "returns" USING btree ("loan_id");--> statement-breakpoint
CREATE INDEX "returns_fine_status_idx" ON "returns" USING btree ("fine_status");--> statement-breakpoint
CREATE INDEX "returns_condition_idx" ON "returns" USING btree ("condition");--> statement-breakpoint
CREATE INDEX "returns_deleted_at_idx" ON "returns" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_username_unique" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_deleted_at_idx" ON "users" USING btree ("deleted_at");