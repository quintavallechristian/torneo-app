alter table "public"."locations" add column "description" text;

alter table "public"."locations" add column "image" text;

alter table "public"."locations" add column "latitude" double precision;

alter table "public"."locations" add column "longitude" double precision;

alter table "public"."matches" add column "location_id" bigint;

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (id);

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."matches" add constraint "matches_location_id_fkey" FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE not valid;

alter table "public"."matches" validate constraint "matches_location_id_fkey";


