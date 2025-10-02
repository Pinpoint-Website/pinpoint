

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, name, username)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'user_name');
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "comment_body" "text" DEFAULT '""'::"text" NOT NULL,
    "post" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "creator" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "likes" bigint DEFAULT '0'::bigint NOT NULL
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


COMMENT ON TABLE "public"."comments" IS 'Comments for the comment section';



CREATE TABLE IF NOT EXISTS "public"."personal_page" (
    "id" "uuid" NOT NULL,
    "primary_role" "text" NOT NULL,
    "description" "text" NOT NULL,
    "photo_path" "text" DEFAULT '""'::"text" NOT NULL
);


ALTER TABLE "public"."personal_page" OWNER TO "postgres";


COMMENT ON TABLE "public"."personal_page" IS 'Data for a user''s personal page';



COMMENT ON COLUMN "public"."personal_page"."photo_path" IS 'Path to profile photo';



CREATE TABLE IF NOT EXISTS "public"."post_tags_join" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "tag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."post_tags_join" OWNER TO "postgres";


COMMENT ON TABLE "public"."post_tags_join" IS 'Join table for posts and tags.';



CREATE TABLE IF NOT EXISTS "public"."posts" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "short_desc" "text" NOT NULL,
    "long_desc" "text" NOT NULL,
    "is_public" boolean NOT NULL,
    "num_interested" bigint DEFAULT '0'::bigint NOT NULL,
    "creator" "uuid",
    "likes" bigint DEFAULT '0'::bigint NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


COMMENT ON TABLE "public"."posts" IS 'Post of a challenge';



COMMENT ON COLUMN "public"."posts"."likes" IS 'number of likes';



CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tag" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


COMMENT ON TABLE "public"."tags" IS 'Tags for posts';



CREATE TABLE IF NOT EXISTS "public"."user_comment_like_join" (
    "user_id" "uuid" NOT NULL,
    "comment_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_comment_like_join" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_like_join" (
    "user_id" "uuid" NOT NULL,
    "post_id" "uuid" NOT NULL
);


ALTER TABLE "public"."user_like_join" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_like_join" IS 'Join table between users and likes';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "username" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'Public user data';



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personal_page"
    ADD CONSTRAINT "personal_page_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_tags_join"
    ADD CONSTRAINT "post_tags_join_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_comment_like_join"
    ADD CONSTRAINT "user_comment_like_join_pkey" PRIMARY KEY ("user_id", "comment_id");



ALTER TABLE ONLY "public"."user_like_join"
    ADD CONSTRAINT "user_like_join_pkey" PRIMARY KEY ("user_id", "post_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



CREATE INDEX "posts_created_at_idx" ON "public"."posts" USING "btree" ("created_at" DESC);



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_creator_fkey" FOREIGN KEY ("creator") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_fkey" FOREIGN KEY ("post") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."personal_page"
    ADD CONSTRAINT "personal_page_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_tags_join"
    ADD CONSTRAINT "post_tags_join_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_tags_join"
    ADD CONSTRAINT "post_tags_join_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_creator_fkey" FOREIGN KEY ("creator") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_comment_like_join"
    ADD CONSTRAINT "user_comment_like_join_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_comment_like_join"
    ADD CONSTRAINT "user_comment_like_join_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_like_join"
    ADD CONSTRAINT "user_like_join_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_like_join"
    ADD CONSTRAINT "user_like_join_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Anon can read" ON "public"."posts" FOR SELECT TO "anon" USING (true);



CREATE POLICY "Auth Can delete" ON "public"."user_comment_like_join" FOR DELETE USING (true);



CREATE POLICY "Auth can insert" ON "public"."post_tags_join" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Auth can insert" ON "public"."tags" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Auth can insert" ON "public"."user_comment_like_join" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Auth can remove" ON "public"."posts" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Auth can select" ON "public"."post_tags_join" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Auth can select" ON "public"."tags" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Auth can select" ON "public"."user_comment_like_join" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated Insert Access" ON "public"."posts" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated Read Access" ON "public"."posts" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated can delete" ON "public"."user_like_join" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Authenticated can insert" ON "public"."personal_page" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated can insert" ON "public"."user_like_join" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Authenticated can select" ON "public"."personal_page" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated can select" ON "public"."users" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Authenticated can update" ON "public"."personal_page" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Authenticated can update" ON "public"."user_like_join" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Insert for auth" ON "public"."comments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Read For authenticated" ON "public"."user_like_join" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Select for auth" ON "public"."comments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Update for auth" ON "public"."comments" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Update for authenticated" ON "public"."posts" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."personal_page" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."post_tags_join" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_comment_like_join" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_like_join" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."personal_page" TO "anon";
GRANT ALL ON TABLE "public"."personal_page" TO "authenticated";
GRANT ALL ON TABLE "public"."personal_page" TO "service_role";



GRANT ALL ON TABLE "public"."post_tags_join" TO "anon";
GRANT ALL ON TABLE "public"."post_tags_join" TO "authenticated";
GRANT ALL ON TABLE "public"."post_tags_join" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."user_comment_like_join" TO "anon";
GRANT ALL ON TABLE "public"."user_comment_like_join" TO "authenticated";
GRANT ALL ON TABLE "public"."user_comment_like_join" TO "service_role";



GRANT ALL ON TABLE "public"."user_like_join" TO "anon";
GRANT ALL ON TABLE "public"."user_like_join" TO "authenticated";
GRANT ALL ON TABLE "public"."user_like_join" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


  create policy "Authed user can see all profile photos 1m83847_0"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable delete for authenticated users only"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable update for authenticated users only"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (true)
with check (true);



  create policy "Give anon users access to JPG images in folder 1m83847_2"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using (((bucket_id = 'profile_photos'::text) AND (storage.extension(name) = 'jpg'::text) AND (lower((storage.foldername(name))[1]) = 'public'::text) AND (auth.role() = 'anon'::text)));



  create policy "Give auth users access to upload images to folder 1m83847_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((auth.uid())::text = (storage.foldername(name))[2]));



