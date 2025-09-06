import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentUserId } from "@/lib/get-user";

export async function PersonalPageDisplay() {
  const supabase = await createClient();
  const userId = await getCurrentUserId();
  const { data: personalPageData, error } = await supabase.from("personal_page").select("description,primary_role").eq("id", userId).single();

  if (error || !personalPageData) {
    console.error("Error fetching post:", error);
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive-foreground">
        <p>Sorry, the personal page could not be found: {personalPageData}</p>
      </div>
    );
  }

  return (
    <Card className="card-hover">
    <CardContent className="p-6">
        <h3 className="text-xl font-semibold tracking-tight mb-2">{personalPageData.primary_role}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{personalPageData.description}</p>
    </CardContent>
    </Card>
  );
}
