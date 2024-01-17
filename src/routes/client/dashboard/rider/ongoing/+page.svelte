<script>
	import SpinnerSet from './../../../SpinnerSet.svelte';
	import { Accordion, AccordionItem, Button, CloseButton, Drawer, Toast } from "flowbite-svelte";
	import SidebarRider from "../SidebarRider.svelte";
	import Sidebar from "../../../../Sidebar.svelte";
	import { hidden2 } from "../../../../stores/sidebar";
	import { sineIn } from "svelte/easing";
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase';

    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    let isRider = true;
    /**
	 * @type {string | undefined}
	 */
    let user_id;

    /**
	 * @type {any[]}
	 */
    let riderData = [];

    
    /**
	 * @type {any[] | undefined}
	 */
    let orders = [];

    /**
	 * @type {unknown}
	 */
    let selectedOrder;

onMount(async () => {
    const userLog = await supabaseClient.auth.getUser();
    user_id = userLog.data.user?.id;

    riderData = await fetchRiderInfo(); 
    console.log(riderData);
    orders = await fetchOrder();
    console.log(orders);
})

async function fetchRiderInfo(){
    let riderData;
    // Fetch the rider from the deliveryrider table
    const { data, error } = await supabaseClient
        .from('deliveryrider')
        .select('*')
        .eq('user_id', user_id);

        if (error) {
        console.error('Error fetching rider info:', error);
        } else if (data && data.length > 0) {
            riderData = data[0];
        }
        return riderData;
}

async function fetchOrder(){
    const { data, error } = await supabaseClient
    .from('sale')
    .select('*, vendor(*), cusorder(*, customer(*), orderitem(*))')
    .eq('riderid', riderData.riderid);

    if (error) {
        console.error('Error fetching orders:', error);
    } else {
        return data;
    }
}

let isSmallDevice = false;

// Function to check the device size
function checkDeviceSize() {
  isSmallDevice = window.innerWidth < 600; // Adjust the breakpoint as needed
}

// Check the device size on component load
checkDeviceSize();

// Listen for window resize event to update the device size
window.addEventListener('resize', checkDeviceSize);
</script>

<SpinnerSet />

<div class="pagecontainer w-[100%] max-w-[100%] flex flex-row mobile-content min-h-[100lvh] bg-white dark:bg-gray-600">
    <SidebarRider />
    <div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937] ">
        <Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
            <div class="flex items-center">
              <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase rounded">Navigation</h5>
              <CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
            </div>
        <Sidebar {isRider} />
        </Drawer>
    </div>
    <div class="page flex flex-col w-[100%] h-[100vh]">
        <div class="realheader bg-black text-white font-bold h-[50px] w-[100%] flex justify-between items-center">
            <div class="lg:text-[24px] md:text-[16px] ml-auto mr-auto ">DELISYOK DELIVERY RIDER CLIENT</div>
        </div>
        {#if !isSmallDevice}
        <div class="maincontainer w-[100%] h-[100%]">
            <div class="contentcontainer flex flex-wrap w-[100%] justify-between h-[100%]">
                <div class="left flex flex-col flex-2 max-w-[250px] p-5 text-black dark:text-white font-semibold h-[100%] bg-gray-100 dark:bg-gray-500 gap-5">
                    <div class="contenttitle text-xl">Ongoing Orders:</div>
                    {#each orders as order}
                        <Button color="blue" on:click={() => {
                            selectedOrder = order;
                        }}>{order.orderid}</Button>
                    {/each}
                </div>
                <div class="right flex flex-col flex-1 w-[100%] h-[100%] items-center">
                    <div class="rectangle flex flex-col w-[50%] min-w-[300px] bg-gray-800 h-[80%] mt-auto mb-auto p-5 text-white font-bold">
                        {#if selectedOrder}
                        <div class="topcontainer grid lg:grid-cols-2 md:grid-flow-row-dense gap-4">
                            <div class="lefttop lg:text-left md:text-center">
                                <div class="saleid">Sale ID: {selectedOrder.saleid}</div>
                                <div class="orderid">Order ID: {selectedOrder.orderid}</div>
                                <div class="customername">Customer Name: {selectedOrder.cusorder.customer.customername}</div>
                                <div class="phone">Phone: {selectedOrder.cusorder.customer.customerhp}</div>
                            </div>
                            <div class="righttop lg:text-right md:text-center">
                                <div class="address">Address: {selectedOrder.deliveryaddress}</div>
                            </div>
                        </div>

                        {/if}
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>
</div>