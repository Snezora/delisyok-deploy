<script>
	import { supabaseClient } from "$lib/supabase";
	import { onMount } from "svelte";

    /**
	 * @type {string | undefined}
	 */
    let user_id;

    /**
	 * @type {any}
	 */
    let riderData = [];
    let user;



onMount(async () => {
    const userLog = await supabaseClient.auth.getUser();
    user_id = userLog.data.user?.id;

    riderData = await fetchRiderInfo();

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
        // This code will run when the auth state changes
        user = !!session?.user;
        if (user) {
            const userLog = await supabaseClient.auth.getUser();
            user_id = userLog.data.user?.id;

            const { data, error } = await supabaseClient
                .from('deliveryrider')
                .select('*')
                .eq('user_id', user_id);


            if (error || data.length == 0) {
                if (typeof window !== 'undefined') {
                    console.log('No rider data found');
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

async function fetchRiderInfo() {

    // Fetch the businessname from the vendor table
    const { data, error } = await supabaseClient
    .from('deliveryrider')
    .select('*')
    .eq('user_id', user_id);

    if (error) {
    console.error('Error fetching business name:', error);
    } else if (data && data.length > 0) {
        riderData = data[0];
    }
    return riderData;
}
</script>

<slot />