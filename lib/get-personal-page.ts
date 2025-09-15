"use server"

import { createClient } from "./supabase/server"
import { PersonalPageData, PersonalPageProps } from "./types";

export async function getPersonalPageData(props: PersonalPageProps): Promise<PersonalPageData> {
  const supabase = await createClient();

  // get the getPersonalPageData
  const { data: personaPageData, error } = await supabase.from("personal_page").select("*").eq("id", props.userId).single();

  //  TODO: handle false thing in edit-personal-page.tsx
  if (error) {
    console.error("Error finding personal page:", error);
    return { description: "", primaryRole: "" };
  }

  const data: PersonalPageData = {
    description: personaPageData.description,
    primaryRole: personaPageData.primary_role,
  };

  return data;

}
