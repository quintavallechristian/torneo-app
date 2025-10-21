create extension if not exists "postgis" with schema "extensions";


alter table "public"."places" add column "geom" geography(Point,4326);