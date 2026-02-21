ALTER TABLE "contacts" ADD COLUMN "id" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_unique" UNIQUE("id");