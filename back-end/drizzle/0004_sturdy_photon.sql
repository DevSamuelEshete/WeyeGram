CREATE TABLE "messages" (
	"id" varchar NOT NULL,
	"contacts_id" varchar NOT NULL,
	"images_url" text[],
	"content" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "messages_id_pk" PRIMARY KEY("id"),
	CONSTRAINT "messages_id_unique" UNIQUE("id"),
	CONSTRAINT "image_or_content_requried" CHECK ("messages"."images_url" IS NOT NULL OR "messages"."content" IS NOT NULL)
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_contacts_id_contacts_id_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;