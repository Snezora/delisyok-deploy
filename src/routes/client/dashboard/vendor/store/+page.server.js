import { supabaseClient } from "$lib/supabase.js";

// export async function load() {
//     const userLog = await supabaseClient.auth.getUser();
//     const user_id = userLog.data.user?.id;

//     cookies.set('user_id', user_id);

//     const { data, error } = await supabaseClient
//     .from('vendor')
//     .select('*')
//     .eq('user_id', user_id);
  
//     return {
//     vendorData: data ?? [],
//     user_id,
//   };
// };