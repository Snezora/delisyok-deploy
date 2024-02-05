<script>
	import { supabaseClient } from "$lib/supabase";
	import { onMount } from "svelte";

    let user;
    let user_id;

onMount(async () => {
    const userLog = await supabaseClient.auth.getUser();
    user_id = userLog.data.user?.id;

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
        // This code will run when the auth state changes
        user = !!session?.user;
        if (user) {
            const userLog = await supabaseClient.auth.getUser();
            user_id = userLog.data.user?.id;

            const { data, error } = await supabaseClient
                .from('systemmanager')
                .select('*')
                .eq('user_id', user_id);


            if (error || data.length == 0) {
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
            }
        } else {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
    });

    window.onfocus = function() {
        location.reload();
    };
})
</script>

<slot />