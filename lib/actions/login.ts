'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server' // Adjust path if needed

// This action takes strings, not FormData
export async function login(email: string, password: string) {
  const supabase = await createClient()

  // Sign in with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // If Supabase returns an error, return it to the form component
  if (error) {
    return { error: 'Invalid email or password.' }
  }

  // On success, revalidate and redirect
  revalidatePath('/', 'layout')
  redirect('/')
}
