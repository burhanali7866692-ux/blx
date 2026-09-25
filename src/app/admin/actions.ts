'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Service Role Key backend par RLS ko bypass karti hai
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function updateAdContactMode(id: number, showContact: boolean) {
  try {
    const { error } = await supabaseAdmin
      .from('ads')
      .update({ show_contact: showContact })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function approveAdAction(id: number) {
  try {
    const { error } = await supabaseAdmin
      .from('ads')
      .update({ is_approved_by_admin: true })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAdAction(id: number) {
  try {
    const { error } = await supabaseAdmin
      .from('ads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}