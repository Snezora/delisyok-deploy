<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { vendorStore } from '../../../stores/businessStore';

    let user;
    /**
	 * @type {string | undefined}
	 */
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
            console.log("onmount in layout triggered");
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


        const vendorData = await fetchBusinessName();
        console.log(vendorData);
        const days = JSON.parse(vendorData.businessopday);
        const openDays = {
            openMonday: days.includes('Monday'),
            openTuesday: days.includes('Tuesday'),
            openWednesday: days.includes('Wednesday'),
            openThursday: days.includes('Thursday'),
            openFriday: days.includes('Friday'),
            openSaturday: days.includes('Saturday'),
            openSunday: days.includes('Sunday'),
        };
        console.log("onmount in layout triggered 2");

        // Update the store
        vendorStore.set({
            ...vendorData,
            ...openDays,
            user_id
        });
    

    });

    async function fetchBusinessName() {

        let vendorData = null;
        
    // Fetch the businessname from the vendor table
    const { data, error } = await supabaseClient
        .from('vendor')
        .select('*')
        .eq('user_id', user_id);

    if (error) {
        console.error('Error fetching business name:', error);
    } else if (data && data.length > 0) {
         vendorData = data[0];
    }
    return vendorData;
    }


</script>

<div class="">
    <slot />
</div>
