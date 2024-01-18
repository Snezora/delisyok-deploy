<script>
	import { StoreSolid } from 'svelte-awesome-icons';
	import SpinnerSet from './../../../SpinnerSet.svelte';
	import { Accordion, AccordionItem, Button, CloseButton, Drawer, Label, Select, Toast } from "flowbite-svelte";
	import SidebarRider from "../SidebarRider.svelte";
	import Sidebar from "../../../../Sidebar.svelte";
    import { CircleUserRegular } from 'svelte-awesome-icons';
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

    /**
	 * @type {{ value: any; name: string; }[]}
	 */
    let orderOptions;

onMount(async () => {
    const userLog = await supabaseClient.auth.getUser();
    user_id = userLog.data.user?.id;

    riderData = await fetchRiderInfo(); 
    console.log(riderData);
    orders = await fetchOrder();
    console.log(orders);

    orderOptions = orders.map(order => ({
        value: order.cusorder.orderid,
        name: `${order.cusorder.orderid}`
    }));
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
    .eq('riderid', riderData.riderid)
    .in('deliverystatus', ['pending', 'ongoing'])
    .order('receiptgenerated', { ascending: true });

    if (error) {
        console.error('Error fetching orders:', error);
    } else {
        return data;
    }
}

	/**
	 * @param {any} addressl1
	 * @param {any} addressl2
	 * @param {any} addresscity
	 * @param {any} addressposcode
	 * @param {any} addressstate
	 */
async function toMaps(addressl1, addressl2, addresscity, addressposcode, addressstate) {
    let address = `${addressl1}, ${addresscity}, ${addressposcode}, ${addressstate}`;

    if (addressl2) {
        address = `${addressl1}, ${addressl2}, ${addresscity}, ${addressposcode}, ${addressstate}`;
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");

}

	/**
	 * @type {any}
	 */
let selectedOrderPhone;

	/**
	 * @param {string | number | boolean} address
	 */
async function shortToMaps(address){
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
    window.open(googleMapsUrl, "_blank");
}

  // Event handler for the change event
  /**
	 * @param {{ target: { value: any; }; }} event
	 */
  function handleSelectChange(event) {
    selectedOrder = orders.find((order) => order.cusorder.orderid === selectedOrderPhone);
    console.log(selectedOrder);
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

async function collectOrder(saleid){
    const { error } = await supabaseClient
    .from('sale')
    .update({ deliverystatus: "ongoing" })
    .eq('saleid', saleid);

    if (error) {
        console.error('Error updating order status:', error);
    } else {
        console.log('Order status updated successfully');
        alert('Order status updated successfully');
        window.location.reload();
    }
}

async function deliveredOrder(saleid){
    const { error } = await supabaseClient
    .from('sale')
    .update({ deliverystatus: "completed" })
    .eq('saleid', saleid);

    if (error) {
        console.error('Error updating order status:', error);
    } else {
        console.log('Order status updated successfully');
        alert('Order status updated successfully');
        window.location.reload();
    }
}
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
    <div class="page flex flex-col w-[100%] min-h-[100vh]">
        <div class="realheader bg-black text-white font-bold h-[50px] w-[100%] flex justify-between items-center">
            <div class="lg:text-[24px] md:text-[16px] ml-auto mr-auto ">DELISYOK DELIVERY RIDER CLIENT</div>
        </div>
        {#if !isSmallDevice}
            <div class="maincontainer w-[100%] h-[100%] flex">
                <div class="contentcontainer flex flex-row w-[100%] justify-between h-[100%]">
                    <div class="left flex flex-col flex-2 max-w-[250px] p-5 text-black dark:text-white font-semibold h-[100%] bg-gray-100 dark:bg-gray-500 gap-5">
                        <div class="contenttitle text-xl">Ongoing Orders:</div>
                        {#each orders as order}
                            <Button on:click={() => {
                                selectedOrder = order;
                            }}>{order.orderid}</Button>
                        {/each}
                    </div>
                    <div class="right flex flex-col flex-1 w-[100%] h-[100%] items-center justify-center gap-3 my-6 pb-10">
                        <div class="rectangle flex flex-col w-[50%] min-w-[300px] bg-gray-800 min-h-[80%] p-5 text-white font-bold gap-4">
                            {#if selectedOrder}
                            <hr />
                            <h1 class="title text-center w-[100%] text-[24px]">Customer Details</h1>
                            <hr />
                            <div class="topcontainer grid lg:grid-cols-2 md:grid-flow-row-dense gap-4">
                                <div class="lefttop lg:text-left md:text-center">
                                    <div class="saleid">Sale ID: {selectedOrder.saleid}</div>
                                    <div class="orderid">Order ID: {selectedOrder.orderid}</div>
                                    <div class="customername">Customer Name: {selectedOrder.cusorder.customer.customername}</div>
                                    <div class="phone">Phone: {selectedOrder.cusorder.customer.customerhp}</div>
                                </div>
                                <div class="righttop lg:text-right md:text-center">
                                    <div class="address">Delivery Address: {selectedOrder.deliveryaddress}</div>
                                    <Button color="blue" class="p-[0.4rem] mt-1 gap-2" on:click={() => shortToMaps(selectedOrder.deliveryaddress)}><CircleUserRegular /> Navigate To Customer</Button>
                                </div>
                            </div>
                            <hr />
                            <h1 class="title text-center w-[100%] text-[24px]">Vendor Details</h1>
                            <hr />
                            <div class="topcontainer grid lg:grid-cols-2 md:grid-flow-row-dense gap-4">
                                <div class="lefttop lg:text-left md:text-center">
                                    <div class="vendorname">Vendor Business Name: {selectedOrder.vendor.businessname}</div>
                                    <div class="vendorpic">Vendor PIC: {selectedOrder.vendor.vendorpicname}</div>
                                    <div class="phone">Phone: {selectedOrder.vendor.vendorhp}</div>
                                </div>
                                <div class="righttop lg:text-right md:text-center">
                                    <p class="text-white flex align-middle">Vendor Address: 
                                        {#if selectedOrder.vendor.vendoraddressl2}
                                        {selectedOrder.vendor.vendoraddressl1}, {selectedOrder.vendor.vendoraddressl2}, 
                                        {:else}
                                        {selectedOrder.vendor.vendoraddressl1},
                                        {/if}
                                        {selectedOrder.vendor.vendoraddresscity}, {selectedOrder.vendor.vendoraddressposcode} {selectedOrder.vendor.vendoraddressstate}
                                    </p>
                                    <Button color="blue" class="p-[0.4rem] mt-1 gap-2" on:click={() => toMaps(selectedOrder.vendor.vendoraddressl1, selectedOrder.vendor.vendoraddressl2, selectedOrder.vendor.vendoraddresscity, selectedOrder.vendor.vendoraddressposcode, selectedOrder.vendor.vendoraddressstate)}><StoreSolid /> Navigate To Vendor</Button>
                                </div>
                            </div>
                            <hr />
                            <h1 class="title text-center w-[100%] text-[24px]">Order Details</h1>
                            <div class="itemcontainer py-2 px-4">
                                {#each selectedOrder.cusorder.orderitem as item}
                                <div class="itemcolumn flex flex-col py-2 justify-self-center">
                                    <hr class="w-[100%] pb-5"/>
                                    <div class="iteminfo flex flex-col gap-3 px-5">
                                        <div class="itemname">{item.itemname}</div>
                                        <div class="itemremark">
                                            Remark: 
                                            {#if item.remark}
                                                {item.remark}
                                            {:else}
                                                -
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                                
                                {/each}
                                <hr class="w-[100%] my-3 px-4"/>
                            </div>

                            <div class="buttoncontainers flex flex-row gap-3 self-center">
                                {#if selectedOrder.deliverystatus === "ongoing"}
                                    <Button color="green" on:click={() => {deliveredOrder(selectedOrder.saleid)}}>Order Delivered</Button>
                                {:else if selectedOrder.deliverystatus === "pending"}
                                    <Button color="green" on:click={() => {collectOrder(selectedOrder.saleid)}}>Order Collected</Button>
                                {:else}
                                    <Button color="red" disabled>Order Completed</Button>
                                {/if}
                            </div>
                            {/if}
                        </div>


                    </div>
                </div>
            </div>
        {:else}
            <div class="maincontainer w-[100%] h-[100%] flex flex-col">
                <div class="contentcontainer flex flex-col w-[100%] justify-between">
                    <Label for="input-group-1" class="block mb-2 ml-2 mt-5">Order</Label>
                    <Select items={orderOptions} bind:value={selectedOrderPhone} on:change={handleSelectChange}/>
                </div>
                <div class="right flex flex-col w-[100%] h-[100%] items-center justify-center gap-3 my-6 pb-10">
                    <div class="rectangle flex flex-col w-[50%] min-w-[300px] bg-gray-800 min-h-[80%] p-5 text-white font-bold gap-4">
                        {#if selectedOrder}
                        <hr />
                        <h1 class="title text-center w-[100%] text-[24px]">Customer Details</h1>
                        <hr />
                        <div class="topcontainer grid lg:grid-cols-2 md:grid-flow-row-dense gap-4">
                            <div class="lefttop lg:text-left md:text-center">
                                <div class="saleid">Sale ID: {selectedOrder.saleid}</div>
                                <div class="orderid">Order ID: {selectedOrder.orderid}</div>
                                <div class="customername">Customer Name: {selectedOrder.cusorder.customer.customername}</div>
                                <div class="phone">Phone: {selectedOrder.cusorder.customer.customerhp}</div>
                            </div>
                            <div class="righttop lg:text-right md:text-center flex flex-col">
                                <div class="address">Delivery Address: {selectedOrder.deliveryaddress}</div>
                                <Button color="blue" class="p-[0.4rem] mt-3 gap-2 self-center" on:click={() => shortToMaps(selectedOrder.deliveryaddress)}><CircleUserRegular /> Navigate To Customer</Button>
                            </div>
                        </div>
                        <hr />
                        <h1 class="title text-center w-[100%] text-[24px]">Vendor Details</h1>
                        <hr />
                        <div class="topcontainer grid lg:grid-cols-2 md:grid-flow-row-dense gap-4">
                            <div class="lefttop lg:text-left md:text-center">
                                <div class="vendorname">Vendor Business Name: {selectedOrder.vendor.businessname}</div>
                                <div class="vendorpic">Vendor PIC: {selectedOrder.vendor.vendorpicname}</div>
                                <div class="phone">Phone: {selectedOrder.vendor.vendorhp}</div>
                            </div>
                            <div class="righttop lg:text-right md:text-center flex flex-col">
                                <p class="text-white flex align-middle">Vendor Address: 
                                    {#if selectedOrder.vendor.vendoraddressl2}
                                    {selectedOrder.vendor.vendoraddressl1}, {selectedOrder.vendor.vendoraddressl2}, 
                                    {:else}
                                    {selectedOrder.vendor.vendoraddressl1},
                                    {/if}
                                    {selectedOrder.vendor.vendoraddresscity}, {selectedOrder.vendor.vendoraddressposcode} {selectedOrder.vendor.vendoraddressstate}
                                </p>
                                <Button color="blue" class="p-[0.4rem] mt-3 gap-2 self-center" on:click={() => toMaps(selectedOrder.vendor.vendoraddressl1, selectedOrder.vendor.vendoraddressl2, selectedOrder.vendor.vendoraddresscity, selectedOrder.vendor.vendoraddressposcode, selectedOrder.vendor.vendoraddressstate)}><StoreSolid /> Navigate To Vendor</Button>
                            </div>
                        </div>
                        <hr />
                        <h1 class="title text-center w-[100%] text-[24px]">Order Details</h1>
                        <div class="itemcontainer py-2 px-4">
                            {#each selectedOrder.cusorder.orderitem as item}
                            <div class="itemcolumn flex flex-col py-2 justify-self-center">
                                <hr class="w-[100%] pb-5"/>
                                <div class="iteminfo flex flex-col gap-3 px-5">
                                    <div class="itemname">{item.itemname}</div>
                                    <div class="itemremark">
                                        Remark: 
                                        {#if item.remark}
                                            {item.remark}
                                        {:else}
                                            -
                                        {/if}
                                    </div>
                                </div>
                            </div>
                            
                            {/each}
                            <hr class="w-[100%] my-3 px-4"/>
                        </div>

                        <div class="buttoncontainers flex flex-row gap-3 self-center">
                            {#if selectedOrder.deliverystatus === "ongoing"}
                                <Button color="green" on:click={() => {deliveredOrder(selectedOrder.saleid)}}>Order Delivered</Button>
                            {:else if selectedOrder.deliverystatus === "pending"}
                                <Button color="green" on:click={() => {collectOrder(selectedOrder.saleid)}}>Order Collected</Button>
                            {:else}
                                <Button color="red" disabled>Order Completed</Button>
                            {/if}
                        </div>
                        {/if}
                    </div>
                </div>
            </div> 
        {/if}
    </div>
</div>