import { createClient } from './supabase/server'; // Adjust the import path as needed
import { redirect } from 'next/navigation';

export async function getCurrentUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    // Handle the error, send them to the login screen if they're not logged in
    console.error("Error fetching user:", error.message);
    return redirect("/auth/login");
  }

  // Return the user id if possible
  return user?.id;
}