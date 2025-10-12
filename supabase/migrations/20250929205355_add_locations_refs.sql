alter table "public"."places" add column "description" text;

alter table "public"."places" add column "image" text;

alter table "public"."places" add column "latitude" double precision;

alter table "public"."places" add column "longitude" double precision;

alter table "public"."matches" add column "place_id" bigint;

CREATE UNIQUE INDEX places_pkey ON public.places USING btree (id);

alter table "public"."places" add constraint "places_pkey" PRIMARY KEY using index "places_pkey";

alter table "public"."matches" add constraint "matches_place_id_fkey" FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE not valid;

alter table "public"."matches" validate constraint "matches_place_id_fkey";


