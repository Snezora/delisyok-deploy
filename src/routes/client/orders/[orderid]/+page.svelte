<script>
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabase';
	import { Button, StepIndicator, DarkMode } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	const orderid = $page.params.orderid;
	let user_id;
	/**
	 * @type {any}
	 */
	let vendorid;
	/**
	 * @type {any[]}
	 */
	let orderdeets = [];

	/**
	 * @type {any[] | undefined}
	 */
	let fooditems = [];
	/**
	 * @type {any[]}
	 */
	let pricelist = [];
	/**
	 * @type {number}
	 */
	let pricetotal;
	/**
	 * @type {number}
	 */
	let salestax;
	/**
	 * @type {number}
	 */
	let ordertotalprice;
	/**
	 * @type {number}
	 */
	let riderComm;

	let currentStep = 1;
	let colour = 'default';

	let steps = [
		'Your Order has been received by the Vendor',
		'Vendor is cooking your order...',
		'On Delivery',
		'Delivered'
	];

	onMount(async () => {
		// Check if the user is signed in
		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;

		orderdeets = await fetchOrderData();
		console.log(orderdeets);
		fooditems = await fetchOrderItems();
		console.log(fooditems);
		fooditems.forEach((element) => {
			addPrices(element.itemprice);
		});
		console.log(pricetotal);
		salestax = ((pricetotal * 0.08).toFixed(2));
		console.log(salestax);
		riderComm = 5;
		ordertotalprice = Number.parseFloat((pricetotal + riderComm + salestax).toFixed(2));
		uploadData();
		determineStep();

		const channels = supabaseClient
			.channel('custom-update-channel')
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sale', filter: `orderid=eq.${orderid}` }, (payload) => {
				window.location.reload();
			})
			.subscribe();
	});

	function determineStep() {
		if (orderdeets.vendororderstatus == 'pending' && orderdeets.deliverystatus != 'cancelled') {
			currentStep = 1;
		} else if (
			(orderdeets.vendororderstatus == 'ongoing' && orderdeets.deliverystatus != 'cancelled') ||
			(orderdeets.vendororderstatus == 'completed' && orderdeets.deliverystatus == 'pending')
		) {
			currentStep = 2;
		} else if (
			orderdeets.deliverystatus == 'ongoing' &&
			orderdeets.vendororderstatus == 'completed'
		) {
			currentStep = 3;
		} else if (
			orderdeets.vendororderstatus == 'completed' &&
			orderdeets.deliverystatus == 'completed'
		) {
			currentStep = 4;
		} else {
			currentStep = 5;
		}
	}

	async function fetchOrderData() {
		const { data, error } = await supabaseClient
			.from('sale')
			.select('*, cusorder(*, customer(*)), deliveryrider(*), vendor(*)')
			.eq('orderid', orderid);

		if (error) {
			console.error('Error fetching order data:', error);
		} else {
			return data[0];
		}
	}

	async function fetchOrderItems() {
		const { data, error } = await supabaseClient
			.from('orderitem')
			.select('*')
			.eq('orderid', orderid);

		if (error) {
			console.error('Error fetching order items:', error);
		} else {
			return data;
		}
	}

	async function addPrices(price) {
		pricelist.push(price);
		pricetotal = pricelist.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		return pricetotal;
	}

	async function uploadData() {
		const { error } = await supabaseClient
			.from('sale')
			.update({
				totalamount: ordertotalprice,
				ridercomission: riderComm
			})
			.eq('saleid', orderdeets?.saleid);
	}
</script>

<div class="maincontainer flex w-[100%] flex-col dark:bg-gray-800 dark:text-white">
	<div class="topbar flex justify-between align-middle h-[52px] bg-red-400 dark:bg-red-900 p-2">
		<Button
			color="red"
			on:click={() => {
				history.back();
			}}>Back</Button
		>
		<div class="text-2xl font-bold">Order #{orderid}</div>
		<DarkMode />
	</div>
	<div class="customerdeets flex bg-gray-300 flex-col p-3 gap-4 dark:bg-gray-600">
		<div class="title text-xl font-bold text-center">Customer Details</div>
		<hr />
		<div
			class="customerdetails grid md:grid-flow-col justify-center gap-5 md:gap-[5rem] sm:grid-flow-row"
		>
			<div class="firsthalfcd flex flex-col gap-2">
				<div class="name">Name: {orderdeets?.cusorder?.customer?.customername}</div>
				<div class="email">Email: {orderdeets?.cusorder?.customer?.customeremail}</div>
			</div>
			<div class="secondhalfcd flex flex-col gap-2">
				<div class="address">Address: {orderdeets?.deliveryaddress}</div>
				<div class="phone">Phone: {orderdeets?.cusorder?.customer?.customerhp}</div>
			</div>
		</div>
	</div>
	<div class="orderfoods p-3 gap-4 flex flex-col">
		<div class="title text-xl font-bold pb-2 text-center">Restaurant Details</div>
		<div
			class="customerdetails grid md:grid-flow-col justify-center gap-5 md:gap-[5rem] sm:grid-flow-row"
		>
			<div class="firsthalfcd flex flex-col gap-2">
				<div class="name">Business Name: {orderdeets?.vendor?.businessname}</div>
				<div class="email">Email: {orderdeets?.vendor?.vendoremail}</div>
			</div>
			<div class="secondhalfcd flex flex-col gap-2">
				<div class="phone">Phone: {orderdeets?.vendor?.vendorhp}</div>
			</div>
		</div>
		<hr />
		<div class="title text-xl font-bold pb-2 text-center">Order Items</div>
		{#each fooditems as item}
			<hr class="pb-2" />
			<div class="deets flex flex-col">
				<div class="nameprice flex flex-row justify-between px-10 pt-3">
					<div class="itemname font-bold">
						{item?.itemname}
					</div>
					<div class="itemname">
						RM {item?.itemprice}
					</div>
				</div>
				<div class="remark px-10 py-3">
					{#if item?.remark}
						Remark: {item.remark}
					{:else}
						Remark: -
					{/if}
				</div>
			</div>
		{/each}
		<hr />
		<div class="endoffoods flex flex-col text-right px-10 py-3">
			<div class="totalbefore">Total Before Tax: RM {pricetotal}</div>
			<div class="tax">SST (8%): RM {salestax}</div>
			<div class="test">Delivery Fee: RM 5.00</div>
			<div class="totalprice text-xl font-bold pt-1">Total: RM {ordertotalprice}</div>
		</div>
	</div>
	<div
		class="deliveryinfo py-3 bg-gray-100 px-10 justify-center flex flex-col gap-4 dark:bg-gray-600"
	>
		<div class="title text-xl font-bold pb-2 text-center pt-2">Delivery Details</div>
		<div
			class="customerdetails grid md:grid-flow-col justify-center gap-5 md:gap-[5rem] sm:grid-flow-row pb-2"
		>
			<div class="firsthalfcd flex flex-col gap-2">
				<div class="name">Name: {orderdeets?.deliveryrider?.ridername}</div>
				<div class="email">RiderID: {orderdeets?.deliveryrider?.riderid}</div>
			</div>
			<div class="secondhalfcd flex flex-col gap-2">
				<div class="address">
					Rider Plate Number: {orderdeets?.deliveryrider?.ridervehicleplate}
				</div>
				<div class="phone">Phone: {orderdeets?.deliveryrider?.riderhp}</div>
			</div>
		</div>
        <span class="text-center w-[100%] text-xs">If you don't see any name, it means we're trying to find a driver for you.</span>
		<div class="trackingsection bg-black text-white p-6 rounded-xl">
			{#if currentStep == 1 || currentStep == 2 || currentStep == 3}
				<StepIndicator {currentStep} {steps} color="blue" />
			{:else if currentStep == 4}
				<StepIndicator {currentStep} {steps} color="green" />
			{:else if currentStep == 5}
				<StepIndicator
					currentStep={1}
					steps={['Your order has been cancelled. Please contact customer service.']}
					color="red"
				/>
			{/if}
		</div>
	</div>
</div>
