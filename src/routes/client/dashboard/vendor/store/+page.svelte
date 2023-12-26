<script>
    import { Button, Drawer, CloseButton, ImagePlaceholder, Card, Fileupload } from 'flowbite-svelte';
    import Sidebar from '../../../../Sidebar.svelte';
    import { sineIn } from 'svelte/easing';
    import { CompassSolid } from 'svelte-awesome-icons';
    import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import { user } from '../../../../stores/authStore.js';
    import { hidden2 } from '../../../../stores/sidebar.js';
	import SidebarVendor from '../SidebarVendor.svelte';

    let isVendor = true;
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    /**
	 * @type {any}
	 */
    let businessname;
    /**
	 * @type {any}
	 */
    let vendorData;
    let user_id;
    /**
	 * @type {any}
	 */
    let storephoto;
    /**
	 * @type {string}
	 */
    let storephotourl;

    onMount(async () => {
        vendorData = await fetchBusinessName();
        console.log(vendorData);
        businessname = vendorData.businessname;
        storephoto = vendorData.storephoto;
        storephotourl = await getStorePhoto();
        console.log(storephotourl);
    });

    async function fetchBusinessName() {
        // Check if the user is signed in
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

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


    async function getStorePhoto() {
        const { data } = supabaseClient
        .storage
        .from('vendorstore')
        .getPublicUrl(`${storephoto}`);

        return data.publicUrl;
    }

    $: activeurl = $page.url.pathname;
</script>


<div class="pagecontainer h-[100vh] w-[100%] flex flex-row mobile-content">
    <SidebarVendor />
    <div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937] ">
        <Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
            <div class="flex items-center">
              <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase rounded">Navigation for {businessname}</h5>
              <CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
            </div>
        <Sidebar {isVendor} />
        </Drawer>
    </div>
    <div class="w-[100%] bg-slate-300 dark:bg-pdark-100 overflow-x-hidden flex flex-col p-5">
        <div class="storephoto w-[100%] flex-wrap flex items-center justify-around">
            <div class="flex justify-center">            
            {#if storephoto}
                <img src={storephotourl} alt="storephoto" class="w-[100%] h-[100%]" />
            {:else}
                <img src="https://placehold.co/450x225" alt="storephoto" class="w-[450px]" />
            {/if}
            </div>
            <div class="flex w-[60%] justify-center flex-col items-center gap-6">
                <div class="intro font-extrabold text-[36px] dark:text-white">Store Front Information for {businessname}</div>
                <div class="fileuploadingarea">
                    <span class="dark:text-white">Upload your store front image here:</span>
                    <Fileupload accept=".png, .jpg, .jpeg" color="white" class="border-none m-[1px] bg-white dark:bg-gray-500 dark:text-white w-[400px]" ></Fileupload>
                </div>
                <Button>Submit Photo</Button>
            </div>
        </div>
    </div>
</div>