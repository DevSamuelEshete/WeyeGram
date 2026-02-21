ALTER TABLE "contacts" DROP CONSTRAINT "contacts_user1_id_user2_id_pk";--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_id_pk" PRIMARY KEY("id");