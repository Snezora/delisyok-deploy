<script>
    /** @type {import('./$types').PageData} */
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import TrashBin from './trash.svelte';
    import  { Button, DarkMode, Label, Modal, Textarea } from 'flowbite-svelte';
    import {ArrowLeftOutline, CartOutline, ExclamationCircleOutline} from 'flowbite-svelte-icons';
	import SidebarCustomer from "../../SidebarCustomer.svelte";
    let popupModal = false;

    const vendorid = $page.params.vendorMenu;
    let userData;
    /**
	 * @type {any}
	 */
    let customerData;
    /**
	 * @type {never[]}
	 */
    let vendorData = [];
    let cart = [];
    let user_id;
    let sidebarOpen = false;

    async function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

    onMount(async () => {
        console.log('im here start');
        customerData = await fetchCustomerData();
        console.log(customerData);
        vendorData = await getVendor();
        console.log(vendorData);
        cart = await fetchCart();
        console.log(cart);

    });

    async function fetchCustomerData(){
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;
        console.log('im here');

        const { data, error } = await supabaseClient
        .from('customer')
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

    async function fetchCart(){
        const { data, error } = await supabaseClient
        .from('cusorder')
        .select('*')
        .eq('customerid', customerData.customerid)
        .eq('cartstatus', 'unpaid')
        .order('ordergenerated', { ascending: false })

        if (error){
            console.error('Error creating new cart: ', error);
        } else {
            return data[0];
        }
    }

    async function deleteOrderItem(){
        alert('Delete successful')
    }

    //export let data;

</script>

<div class="fixed z-10">
	{#if sidebarOpen}
		<div class="fixed">
			<SidebarCustomer />
		</div>
	{/if}
</div>

<div class="page-container min-h-[100vh] mb-10 overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-16 bg-gray-900 px-4 flex flex-row justify-between">
        <Button pill={true} outline={true} class="my-4" on:click={() => window.history.back()}>
            <ArrowLeftOutline class="w-4 h-4 text-white" />
        </Button>
        <div class="flex flex-col items-center pt-auto pb-auto">
            <div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
                <h1>Cart</h1>
            </div>
    
            <div class="text-base text-white w-full h-8 flex items-center justify-center">
                <h1>For {vendorData.businessname}</h1>
            </div>
        </div>
        <div class="rightside gap-3 flex flex-row">
            <DarkMode class="h-[60%] mt-auto mb-auto"></DarkMode>
        </div>
    </div>
    <div class="absolute z-10">
        <button
            class="z-10 w-[50px] h-[50px] transition-[width] duration-[0.3s] ease-[ease-in-out] border bg-[#f8f9fa] border-solid border-[#f8f9fa] hover:bg-slate-300 {sidebarOpen
                ? 'translate-x-[200px] translate-y-[-65px] fixed'
                : ''}"
            on:click={toggleSidebar}
        >
            Menu
        </button>
    </div>

</div> 

<Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Item Added!</h3>
      <Button color="red" class="me-2" on:click={backMenu}>Back to Menu</Button>
      <Button color="alternative">View Cart</Button>
    </div>
</Modal>

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