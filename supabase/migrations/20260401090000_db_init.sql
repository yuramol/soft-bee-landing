CREATE TABLE "public"."users"(
  "id" uuid NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
  "first_name" text,
  "last_name" text,
  "logo_url" text,
  "phone" text
);

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree(id);

ALTER TABLE "public"."users"
  ADD CONSTRAINT "users_pkey" PRIMARY KEY USING INDEX "users_pkey";

CREATE OR REPLACE FUNCTION public.trim_and_lowercase_email()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SET search_path = ''
  AS $function$
BEGIN
  NEW.email := LOWER(TRIM(NEW.email));
  RETURN NEW;
END;
$function$;

