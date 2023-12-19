import { supabaseClient } from "$lib/supabase";


export async function load() {
  const { data, error } = await supabaseClient
    .from("menuitem")
    .select();
  
    return {
    menuitem: data ?? [],
  };
}