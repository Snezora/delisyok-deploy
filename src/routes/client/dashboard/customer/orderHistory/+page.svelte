<script>
    /** @type {import('./$types').PageData} */
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import TrashBin from './trash.svelte';
    import  { Button, Modal } from 'flowbite-svelte';
    import {ExclamationCircleOutline} from 'flowbite-svelte-icons';
    let popupModal = false;

    let userData;
    /**
	 * @type {any}
	 */
    let customerData;
    let user_id;

    onMount(async () => {
        console.log('im here start');
        customerData = await fetchCustomerData();
        console.log(customerData);
    });

    async function fetchCustomerData(){
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;
        console.log('im here');

        const {data, error} = await supabaseClient.from('Customer')
        .select('*')
        .eq('user_id', user_id);

        if (error){
            console.error('Error fetching customer name: ', error);
        } else if (data && data.length > 0){
            customerData = data[0];
            console.log('enter');
        }
        return customerData;
    }

    async function deleteOrderItem(){
        alert('Delete successful')
    }

    //export let data;

</script>
<div class="topSpace"></div>
<div class="titleBar">
        <h1>Hello World</h1>
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