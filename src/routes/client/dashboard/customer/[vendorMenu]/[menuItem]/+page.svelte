<script>
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import TrashBin from '../cart/trash.svelte';
    import  { Button, Modal } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import {ExclamationCircleOutline} from 'flowbite-svelte-icons';
    let popupModal = false;

    const itemid = $page.params.menuItem;
    let userData;
    /**
	 * @type {any}
	 */
    let customerData;
    /**
	 * @type {string | undefined}
	 */
    let user_id;

    /**
	 * @type {any[]}
	 */
    let menuItemData = []; //Here is the menu Item Data

    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;
        menuItemData = await fetchMenuItemData();
        console.log(menuItemData);
        console.log('im here start');
        customerData = await fetchCustomerData();
        console.log(customerData);

    });

    async function fetchMenuItemData(){
        const { data, error } = await supabaseClient
        .from('menuitem')
        .select('*')
        .eq('itemid', itemid);

        if (error){
            console.error('Error fetching menu item: ', error);
        } else {
            return data[0];
        }
    }

    async function fetchCustomerData(){

        const { data, error } = await supabaseClient.from('customer')
        .select('*')
        .eq('user_id', user_id);

        if (error){
            console.error('Error fetching customer name: ', error);
        } else if (data && data.length > 0){
            return data[0];
        }
    }

    async function deleteOrderItem(){
        alert('Delete successful')
    }

    //export let data;

</script>

<div class="topSpace"></div>
<div class="titleBar">
        <h1>Hello World, this is the page for {menuItemData.itemname}</h1> 
        <!-- If it's like this with red line beneath itemname, its normal, leave it -->
</div>

<div>
    <TrashBin deleteOrderItem={deleteOrderItem} />
</div>

<style>
    .titleBar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: orange;
    }
    .topSpace{
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
    }
</style>