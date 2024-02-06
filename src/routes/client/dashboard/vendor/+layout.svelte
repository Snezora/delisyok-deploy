<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { uploadingFile, vendorStore } from '../../../stores/businessStore';
	import { Spinner } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

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

    /**
	 * @type {any}
	 */
    let storephoto;
    let storephotourl;

    // var blurred = false;
    // window.onblur = function() { blurred = true; };

    
    onMount(async () => {



    const userLog = await supabaseClient.auth.getUser();
    user_id = userLog.data.user?.id;

    console.log("onmount in layout triggered");

    // This code will run immediately when the component mounts
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

    storephoto = vendorData.storephoto;
    storephotourl = await getStorePhoto();

    // Update the store
    vendorStore.set({
        ...vendorData,
        ...openDays,
        storephotourl,
        user_id
    });

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
        // This code will run when the auth state changes
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
            }
        } else {
            if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
            }
        }
    });

    if ($uploadingFile == false){
        console.log($uploadingFile + " File");
        window.onfocus = function() { (location.reload()); };
    }
});

    async function getStorePhoto() {
            const { data } = supabaseClient
            .storage
            .from('vendorstore')
            .getPublicUrl(`${storephoto}`);

            return data.publicUrl;
        }

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

<style>
    .toastcontainer {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 9999;
    }

    .fade-in {
        transition: opacity 0.5s ease-in;
        opacity: 1;
    }
</style>