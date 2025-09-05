"use server";

import { revalidatePath } from 'next/cache';
import { createClient } from '../supabase/server';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    // You can handle this error more gracefully, for now we'll just throw it.
    throw new Error(error.message);
  }

  // Revalidate the homepage cache and redirect to it
  revalidatePath('/');
  redirect('/');
}