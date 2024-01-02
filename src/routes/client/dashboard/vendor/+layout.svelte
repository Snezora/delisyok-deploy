<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';

    let user;
    let user_id;
    /**
	 * @type {any[] | null}
	 */
    let vendordata = null;
    /**
	 * @type {any[]}
	 */
    let userinfo;
    /**
	 * @type {any}
	 */
    let businessName;


    
    onMount(async () => {
        supabaseClient.auth.onAuthStateChange(async (_, session) => {
            user = !!session?.user;
            if (user) {
                const userLog = await supabaseClient.auth.getUser();
                user_id = userLog.data.user?.id;

                const { data, error } = await supabaseClient
                    .from('vendor')
                    .select('*')
                    .eq('user_id', user_id);

                    vendordata = data;

                if (error || data.length == 0) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/auth/login';
                    }
                } else {

                }
            } else {
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
            }
        });

        
    });



</script>

<div class="">
    <slot />
</div>
