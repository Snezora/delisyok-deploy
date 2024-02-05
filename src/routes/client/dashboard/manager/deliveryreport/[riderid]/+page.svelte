<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import {
		Drawer,
		CloseButton,
		Accordion,
		AccordionItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button
	} from 'flowbite-svelte';
	import { hidden2 } from '../../../../../stores/sidebar';
	import Sidebar from '../../../../../Sidebar.svelte';
	import { sineIn } from 'svelte/easing';
	import SpinnerSet from '../../../../SpinnerSet.svelte';

	import { goto } from '$app/navigation';

	const riderid = $page.params.riderid;

	/**
	 * @type {never[]}
	 */
	let riderdata = [];
	/**
	 * @type {any[] | undefined}
	 */
    let riderorders = [];

    let earning;

	onMount(async () => {
		const { data, error } = await supabaseClient
			.from('deliveryrider')
			.select('*')
			.eq('riderid', riderid)
			.single();

		if (error) {
			console.log(error);
		} else {
			riderdata = data;
		}

        riderorders = await getOrders();
        earning = getTotal();
        console.log(riderorders);
	});

	async function getOrders() {
		const { data, error } = await supabaseClient
			.from('sale')
			.select('*, cusorder(*), vendor(*), deliveryrider(*)')
            .eq('riderid', riderid)
			.order('receiptgenerated', { ascending: false });

		if (error) {
			console.error('Error fetching orders:', error);
		} else {
			return data;
		}
	}

    function getTotal(){
        let total = 0;

        riderorders.forEach(order => {
            order.ridercomission = parseFloat(order.ridercomission);
            total += order.ridercomission;
        });

        return total;
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
			<h1>Delivery Rider Report</h1>
		</div>

		<div class="md:text-2xl text-sm mt-6 text-white w-full h-full flex items-left justify-left">
			<h1>Name : {riderdata.ridername}</h1>
		</div>

		<div class="md:text-2xl text-sm mt-6 text-white w-full h-full flex justify-items-start">
			<h1>Rider ID : {riderdata.riderid}</h1>
		</div>
	</div>

    {#each riderorders as order}
        <div class = "body mt-8 text-xl bg-grey flex flex-col items-center justify-left">
            <div class="orderBlock">
                <div class="ml-8 mt-1 p-5 grid md:grid-cols-2 grid-row-1">
                    <div class="firstpart">
                        <h1>Sales ID: {order.saleid}</h1>
                        <h1>Receipt Generated: {formatDate(order.receiptgenerated)}</h1>
                    </div>
                    <div class="secondpart">
                        <h1>Delivery Status: {capitalizeFirstLetter(order.deliverystatus)}</h1>
                        <h1>Commission: RM {order.ridercomission}</h1>
                    </div>

                </div>
                
            </div>
                
        </div>
    {/each}
    
    <div class = "footer mt-8 text-white text-2xl bg-grey flex flex-col w-[100%] mb-6">
        <div class ="totalCommision w-[100%] self-center">
            <div class ="ml-8 mt-6">
                <h1>Total Commision: RM  {earning}</h1>
            </div>
        </div>
        <div class="text-white text-2xl flex flex-1 self-center">
            <div class="returnPosition flex flex-row align-middle justify-center">
                <Button type="button" class="w-[325px] mt-4" on:click={goTo} id="returnbutton">Return</Button>
            </div>
        </div>
    </div>
</div>

<style>
	.totalCommision {
		display: flex;
		box-sizing: border-box;
		width: 95%;
		height: 80px;

		background: #111827;
		border: 1px solid #000000;
		box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 10px;
	}

	.returnPosition {
		flex: 1;
		border: 2px solid;
		margin: 10px;
	}

	.orderBlock {
		width: 80%;
		height: 20%;
		top: 616px;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background: #d9d9d9;
		border-radius: 20px;
		overflow: auto;
	}
</style>
