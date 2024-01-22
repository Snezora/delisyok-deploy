<script>
	import { TrashCanRegular } from 'svelte-awesome-icons';
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
    /**
	 * @type {never[]}
	 */
    let cart = [];
    /**
	 * @type {any[] | undefined}
	 */
    let orderItems = [];
    let user_id;
    let sidebarOpen = false;
    let pricelist = [];
    let pricetotal = 0;
    /**
	 * @type {number}
	 */
    let riderComm;
    /**
	 * @type {string}
	 */
    let salestax;
    /**
	 * @type {string}
	 */
    let ordertotalprice;

    /**
	 * @type {any}
	 */
    let selectedItem;

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
        orderItems = await fetchItems();
        console.log(orderItems);
        orderItems.forEach(element => {
            addPrices(element.itemprice);
        });
        console.log(pricetotal);
        salestax = (pricetotal * 0.08).toFixed(2);
        console.log(salestax);
        riderComm = 5;
        ordertotalprice = (pricetotal + riderComm + parseFloat(salestax)).toFixed(2);
        
        console.log(ordertotalprice);

    });

    async function addPrices(price){
        pricelist.push(price);
        pricetotal = pricelist.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        return pricetotal;
    }

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

    async function fetchItems(){
        const { data, error } = await supabaseClient
        .from('orderitem')
        .select('*')
        .eq('orderid', cart.orderid)
        
        if (error){
            console.error('Error creating new cart: ', error);
        } else {
            return data;
        }
    }

    /**
	 * @param {any} orderitemid
	 */
    async function deleteOrderItem(orderitemid){
        const { error } = await supabaseClient
        .from('orderitem')
        .delete()
        .eq('orderitemid', orderitemid)

        if (error){
            console.error('Error deleting item: ', error);
        } else {
            window.location.reload();
        }
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

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-gray-500">
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
    <div class="xlcontainer flex flex-col justify-between min-h-[100vh]">
        <div class="maincontainer pl-10 pb-0 pr-0 pt-[3.1rem]">
            <hr class="dark:border-gray-200 border-gray-700"/>
            <div class="main dark:text-white">
                <div class="flex flex-col p-10 pt-5">
                    <div class="titlegrid grid grid-cols-4 place-items-center mb-5 font-extrabold">
                        <div class="itemname">Item Name</div>
                        <div class="remark">Remark</div>
                        <div class="price">Price</div>
                    </div>
                    <hr class="dark:border-gray-200 border-gray-700 mb-5"/>
                    {#each orderItems as item}
                        <div class="itemcontainer flex flex-col">
                            <div class="titlegrid grid grid-cols-4 place-items-center mb-5">
                                <div class="itemname">{item.itemname}</div>
                                <div class="remark">{item.remark}</div>
                                <div class="third flex flex-row items-center">
                                    <div class="price">RM {item.itemprice}</div>
                                </div>
                                <Button color="none" on:click={() => {
                                    popupModal = true;
                                    selectedItem = item.orderitemid;
                                }}><TrashCanRegular color="red" /></Button>
                            </div>
                        </div>
                        <hr class="dark:border-gray-200 border-gray-700 mb-5"/>
                    {/each}
                </div>
            </div>
        </div>
        <div class="bottom p-[4rem] flex flex-col items-end">
            <div class="totalprice text-[18px]">Subtotal: RM {pricetotal}</div>
            <div class="text-[18px]">Delivery fee: RM {riderComm}</div>
            <div class="tax text-[18px]">Sales Tax: RM {salestax}</div>
            <div class="text-xl font-bold mb-3">Total: RM {ordertotalprice}</div>
            <Button>Checkout</Button>
        </div>
    </div>
</div> 

<Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this item from your cart?</h3>
      <Button color="red" class="me-2" on:click={() => {deleteOrderItem(selectedItem)}}>Yes</Button>
      <Button color="alternative" on:click={() => (popupModal = false)}>No</Button>
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