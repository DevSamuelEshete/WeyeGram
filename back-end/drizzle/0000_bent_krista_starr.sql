CREATE TABLE "contacts" (
	"user1_id" varchar NOT NULL,
	"user2_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "contacts_user1_id_user2_id_pk" PRIMARY KEY("user1_id","user2_id"),
	CONSTRAINT "no_self_contact" CHECK ("contacts"."user1_id" <> "contacts"."user2_id")
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user1_id_users_id_fk" FOREIGN KEY ("user1_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user2_id_users_id_fk" FOREIGN KEY ("user2_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;