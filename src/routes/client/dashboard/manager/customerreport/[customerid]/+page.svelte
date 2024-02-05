<script>
    
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
	import { ArrowLeftOutline } from "flowbite-svelte-icons";
    import { Drawer, CloseButton, Accordion, AccordionItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button } from "flowbite-svelte";
	import { hidden2 } from "../../../../../stores/sidebar";
	import Sidebar from "../../../../../Sidebar.svelte";
	import { sineIn } from "svelte/easing";
	import SpinnerSet from "../../../../SpinnerSet.svelte";

    /**
	 * @type {string}
	 */
    let customerid;
    let user_id;
    /**
	 * @type {never[]}
	 */
    let customerData = [];
    /**
	 * @type {any[] | undefined}
	 */
    let customerorders = [];

    customerid = $page.params.customerid;

    import { goto } from '$app/navigation';

    onMount(async() => {
        const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;

        const { data, error } = await supabaseClient
            .from('customer')
            .select('*')
            .eq('customerid', customerid);

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            customerData = data[0];
        }

        console.log(customerData);

        customerorders = await getOrders();

        console.log(customerorders);

    })

    async function getOrders(){


        const { data, error } = await supabaseClient
            .from('sale')
            .select('*, cusorder(*), vendor(*), deliveryrider(*)')
            .order('receiptgenerated', { ascending: false });

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                const filteredData = data.filter((sale) => sale.cusorder.customerid == customerid);
                return filteredData;            
            }
    }

	function goTo() {
		goto('/client/dashboard/manager');
	}

    function formatDate(dateString) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleString('en-GB', options);
    }

    function capitalizeFirstLetter(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }


     
</script>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-20 bg-gray-900 px-6 flex flex-row justify-between w-[100%]">
        
        <div class="md:text-3xl text-xl mt-5 text-white w-full h-full flex items-left justify-left">
            <h1>Customer Order History</h1>
        </div>

        <div class="md:text-2xl text-sm mt-6 text-white w-full h-full flex items-left justify-left">
            <h1>Name : {customerData.customername}</h1>
        </div>

        <div class="md:text-2xl text-sm mt-6 text-white w-full h-full flex justify-items-start">
            <h1>Customer ID : {customerData.customerid}</h1>
        </div>
    </div>

    {#each customerorders as order}
        <div class = "body mt-8 text-xl bg-grey flex flex-col items-center justify-left">
            <div class="orderBlock">
                <div class="ml-8 mt-1 p-5 grid md:grid-cols-2 grid-row-1">
                    <div class="firstpart mt-1">
                        <h1>Order ID: {order.orderid}</h1>
                        <h1>Order Generated: {formatDate(order.receiptgenerated)}</h1>
                        <h1>Vendor ID: {order.vendorid} ({order.vendor.businessname})</h1>
                        <h1>Rider ID: {order.riderid} 
                            {#if order.riderid != null}
                                ({order.deliveryrider.ridername})
                            {/if}
                        </h1>
                    </div>
                    <div class="secondpart">
                        <h1>Food Total Price: RM {order.totalamount}</h1>
                        <h1>Delivery Fee: RM {order.ridercomission}</h1>
                        <h1>Vendor Order Status: {capitalizeFirstLetter(order.vendororderstatus)}</h1>
                        <h1>Delivery Status: {capitalizeFirstLetter(order.deliverystatus)}</h1>
                        <h1>Refund: 
                            {#if order.refund == false}
                                No Refund Done
                            {:else if order.refund == true}
                                Refund Complete
                            {/if}
                        </h1>
                    </div>

                </div>
                
            </div>
                
        </div>
    {/each}
    
    <div class = "footer mt-8 text-white text-2xl bg-grey flex w-[100%] mb-6">
        <div class="text-white text-2xl flex flex-1 self-center">
            <div class="returnPosition flex flex-row align-middle justify-center">
                <Button type="button" class="w-[325px] mt-4" on:click={goTo} id="returnbutton">Return</Button>
            </div>
        </div>
    </div>
</div>   

<style>

    .returnPosition {
    flex: 1;
    border: 2px solid;
    margin: 10px;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    }

    .orderBlock {
        width: 80%;
        height: 20%;
        top: 616px;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #D9D9D9;
        border-radius: 20px;
        overflow: auto;
    }
</style>
