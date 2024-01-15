<script>
	import SpinnerSet from './../../../SpinnerSet.svelte';
	import { Accordion, AccordionItem, Button, CloseButton, Drawer, Toast } from "flowbite-svelte";
	import SidebarRider from "../SidebarRider.svelte";
	import Sidebar from "../../../../Sidebar.svelte";
	import { hidden2 } from "../../../../stores/sidebar";
	import { sineIn } from "svelte/easing";
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase';

    let isRider = true;
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    /**
	 * @type {string | undefined}
	 */
    let user_id;
    /**
	 * @type {never[]}
	 */
    let riderData = [];
    /**
	 * @type {any[] | undefined}
	 */
    let newOrders = [];

    /**
	 * @type {Promise<any[] | undefined>[]}
	 */
    let orderFoodItems = [];


    // Fetch orders
    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

        riderData = await fetchRiderInfo();
        newOrders = await fetchNewOrders();
        console.log(newOrders);
    });


    async function fetchRiderInfo() {
        let riderData;
        // Fetch the rider from the deliveryrider table
        const { data, error } = await supabaseClient
        .from('deliveryrider')
        .select('*')
        .eq('user_id', user_id);

        if (error) {
        console.error('Error fetching business name:', error);
        } else if (data && data.length > 0) {
            riderData = data[0];
        }
        return riderData;
    }

    async function fetchNewOrders() {
        const { data, error } = await supabaseClient
        .from('sale')
        .select('*, vendor(*), cusorder(*, customer(*), orderitem(*))')
        .is('riderid', null);

        if (error) {
            console.error('Error fetching new orders', error);
        }
        else{
            return data;
        }
    }

    async function toMaps(addressl1, addressl2, addresscity, addressposcode, addressstate) {
        let address = `${addressl1}, ${addresscity}, ${addressposcode}, ${addressstate}`;

        if (addressl2) {
            address = `${addressl1}, ${addressl2}, ${addresscity}, ${addressposcode}, ${addressstate}`;
        }

        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
        window.open(googleMapsUrl, "_blank");

        // Use the 'address' variable as needed
        console.log(address);
        // or return address;
    }

    async function shortToMaps(address){
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
        window.open(googleMapsUrl, "_blank");
    }

    async function acceptOrder(orderid) {
        const { error } = await supabaseClient
        .from('sale')
        .update({ riderid: riderData.riderid })
        .eq('orderid', orderid);

        if (error) {
            console.error('Error accepting order:', error);
        } else {
            console.log('Order accepted successfully');
            alert('Order accepted successfully');
            window.location.reload();

        }
    }


</script>

<SpinnerSet />

<div class="pagecontainer w-[100%] max-w-[100%] flex flex-row mobile-content min-h-[100vh] bg-white dark:bg-gray-600">
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
    <div class="maincontainer flex flex-col w-[100%] gap-5">
        <div class="realheader bg-black text-white font-bold h-[50px] w-[100%] flex justify-between items-center ">
            <div class="lg:text-[24px] md:text-[16px] ml-auto mr-auto ">DELISYOK DELIVERY RIDER CLIENT</div>
        </div>
        <div class="subheader h-[40px] w-[100%] flex items-center text-[24px] p-5 gap-4 dark:text-white font-semibold">
            Delivery Requests
            <Button on:click={() => window.location.reload()}>Refresh</Button>
        </div>
        <div class="contentcontainer flex flex-wrap">
            <div class="ordercontainer flex-1 p-6 min-w-[350px]">
                {#if newOrders?.length > 0}
                <Accordion flush class="flex flex-col ">
                    {#each newOrders as order}
                        <AccordionItem class="mt-6">
                        <span slot="header" class="flex justify-between w-[100%] h-[100%]">
                            <div class="text flex items-center lg:text-[18px] text-[16px]">{order.vendor.businessname} ㅤㅤ Order ID: {order.orderid}</div>
                            <Button class="lg:mr-8 mr-5 w-[60px]" on:click={() => acceptOrder(order.orderid)}>Accept</Button>
                        </span>
                        <div class="vendoraddress mb-4 flex flex-wrap w-[100%] justify-between">
                            <p href="" class="pb-4 text-gray-500 dark:text-gray-400 flex align-middle">Vendor Address: 
                                {#if order.vendor.vendoraddressl2}
                                {order.vendor.vendoraddressl1}, {order.vendor.vendoraddressl2}, 
                                {:else}
                                {order.vendor.vendoraddressl1},
                                {/if}
                                {order.vendor.vendoraddresscity}, {order.vendor.vendoraddressposcode} {order.vendor.vendoraddressstate}
                            </p>
                            <Button color="blue" on:click={() => toMaps(order.vendor.vendoraddressl1, order.vendor.vendoraddressl2, order.vendor.vendoraddresscity, order.vendor.vendoraddressposcode, order.vendor.vendoraddressstate)}>Navigate</Button>
                        </div>
                        <hr />
                        <div class="customeraddress mt-4 flex flex-wrap w-[100%] justify-between">
                            <p class="pb-4 text-gray-500 dark:text-gray-400">Delivery Address: 
                                <!-- {#if order.cusorder.customer.customeraddressl2}
                                {order.cusorder.customer.customeraddressl1} {order.cusorder.customer.customeraddressl2}, 
                                {:else}
                                {order.cusorder.customer.customeraddressl1},
                                {/if}
                                {order.cusorder.customer.customeraddresscity}, {order.cusorder.customer.customeraddressposcode} {order.cusorder.customer.customeraddressstate} -->
                                {order.deliveryaddress}
                            </p>
                            <!-- <Button color="blue" on:click={() => toMaps(order.cusorder.customer.customeraddressl1, order.cusorder.customer.customeraddressl2, order.cusorder.customer.customeraddresscity, order.cusorder.customer.customeraddressposcode, order.cusorder.customer.customeraddressstate)}>Navigate</Button> -->
                            <Button color="blue" on:click={() => shortToMaps(order.deliveryaddress)}>Navigate</Button>

                        </div>
                        </AccordionItem>
                    {/each}
                  </Accordion>
                {:else}
                  <div class="text-xl font-bold dark:text-white">
                    No New Orders at the Moment.
                  </div>
                {/if}
            </div>
            <div class="totalcontainer flex-2 p-6">
                <div class="rectangle w-[250px] m-3 bg-blue-300 h-[300px]">
                    test
                </div>
            </div>
        </div>
    </div>
</div>