<script>
    import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';


    const vendorid = $page.params.vendorMenu;
    let user_id; //Customer ID
    let vendorInfo; //Vendor Information
	/**
	 * @type {any[] | undefined}
	 */
    let vendorMenu = [];
    

    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
        vendorInfo = await getVendor();
        console.log(vendorInfo);
        vendorMenu = await getMenu();
        console.log(vendorMenu);
        //All these console logs, open console to check.
    })

    async function getVendor(){
        const {data, error} = await supabaseClient
        .from('vendor')
        .select('*')
        .eq('vendorid', vendorid);

        if (error) {
            console.error('Error fetching vendor:', error);
        } else {
            return data[0];
        }
    }

    async function getMenu(){
        const {data, error} = await supabaseClient
        .from('menuitem')
        .select('*')
        .eq('vendorid', vendorid);

        if (error) {
            console.error('Error fetching menu:', error);
        } else{
            return data;
        }
    }

    function goToItemPage(itemid){
        window.location.href = `/client/dashboard/customer/${vendorid}/${itemid}`
    }
    
    //To access the menuItem pages, do this href="/client/dashboard/customer/{vendorid}/{itemid}"
</script>

<h1>{vendorid}</h1>

{#each vendorMenu as menuItem}
    <a href="#" on:click={() => goToItemPage(menuItem.itemid)}>{menuItem.itemname}</a>
    <br>
{/each}