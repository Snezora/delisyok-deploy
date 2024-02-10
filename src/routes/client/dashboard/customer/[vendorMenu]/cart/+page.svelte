<script>
	import { TrashCanRegular } from 'svelte-awesome-icons';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Button, DarkMode, Modal } from 'flowbite-svelte';
	import {
		ArrowLeftOutline,
		ExclamationCircleOutline,
		QuestionCircleOutline
	} from 'flowbite-svelte-icons';

	let popupModal = false;

	const vendorid = $page.params.vendorMenu;

	/**
	 * @type {any}
	 */
	let customerData = '';

	/**
	 * @type {any}
	 */
	let vendorData = '';

	/**
	 * @type {any}
	 */
	let cart = '';

	/**
	 * @type {any[] | undefined}
	 */
	let orderItems = [];
	let user_id;
	/**
	 * @type {any[]}
	 */
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
	/**
	 * @type {any}
	 */
	let orderid;

	onMount(async () => {
		console.log('Start Test: Render Cart Page');

		console.log('Fetch Test: Customer Data');
		customerData = await fetchCustomerData();
		console.log(customerData);

		console.log('Fetch Test: Vendor Data');
		vendorData = await getVendor();
		console.log(vendorData);

		console.log('Fetch Test: Cart Data');
		cart = await fetchCart();
		console.log(cart);

		console.log('Initialisation Test: Populating Variable');
		orderid = cart.orderid;
		console.log(orderid);

		console.log('Fetch Test: Order Items Array');
		orderItems = await fetchItems();
		console.log(orderItems);

		console.log('Calculation Test: Calculate total');
		if (orderItems) {
			orderItems.forEach((element) => {
				addPrices(element.itemprice);
			});
		}

		console.log(pricetotal);
		//salestax = (pricetotal * 0.08).toFixed(2);
		console.log(salestax);
		riderComm = 5;
		//ordertotalprice = (pricetotal + riderComm + parseFloat(salestax)).toFixed(2);
		console.log(ordertotalprice);
		uploadPrice();

		console.log('Fetch Test: Cart Data');
		cart = await fetchCart();
		console.log(cart);

		console.log(cart.foodtotalprice);
		salestax = (cart.foodtotalprice * 0.08).toFixed(2);
		ordertotalprice = (cart.foodtotalprice + riderComm + parseFloat(salestax)).toFixed(2);
		console.log('Render Test: Completed');
	});

	async function fetchCustomerData() {
		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;

		const { data, error } = await supabaseClient
			.from('customer')
			.select('*')
			.eq('user_id', user_id);

		if (error) {
			console.error('Error fetching customer name: ', error);
		} else if (data && data.length > 0) {
			customerData = data[0];
			console.log('enter');
		}
		return customerData;
	}

	/**
	 * @param {any} price
	 */
	async function addPrices(price) {
		pricelist.push(price);
		pricetotal = pricelist.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		return pricetotal;
	}

	async function uploadPrice() {
		const { error } = await supabaseClient
			.from('cusorder')
			.update({ foodtotalprice: pricetotal })
			.eq('orderid', orderid);

		if (error) {
			console.error('Error updating price: ', error);
		}
	}

	async function getVendor() {
		const { data, error } = await supabaseClient
			.from('vendor')
			.select('*')
			.eq('vendorid', vendorid);

		if (error) {
			console.error('Error fetching vendor:', error);
		} else {
			return data[0];
		}
	}

	async function fetchCart() {
		const { data, error } = await supabaseClient
			.from('cusorder')
			.select('*')
			.eq('customerid', customerData.customerid)
			.eq('cartstatus', 'unpaid')
			.order('ordergenerated', { ascending: false });

		if (error) {
			console.error('Error creating new cart: ', error);
		} else {
			return data[0];
		}
	}

	async function fetchItems() {
		const { data, error } = await supabaseClient
			.from('orderitem')
			.select('*')
			.eq('orderid', cart.orderid);

		if (error) {
			console.error('Error creating new cart: ', error);
		} else {
			return data;
		}
	}

	/**
	 * @param {any} orderitemid
	 */
	async function deleteOrderItem(orderitemid) {
		const { error } = await supabaseClient
			.from('orderitem')
			.delete()
			.eq('orderitemid', orderitemid);

		if (error) {
			console.error('Error deleting item: ', error);
		} else {
			window.location.reload();
		}
	}

	let showHelp = false;

	function toggleHelp() {
		showHelp = !showHelp;
	}

	function alertNoItems() {
		alert('No items in cart.');
	}
	//export let data;
</script>

<div
	class="{showHelp
		? 'block'
		: 'hidden'} z-20 fixed inset-0 bg-semi-transparent flex items-center justify-center"
>
	<div class="p-4 bg-white rounded shadow-lg">
		<h2 class="text-2xl font-bold mb-2">Help</h2>
		<div class="mt-[20px]">
			<p class="font-bold">Want to delete a food item?</p>
			<p class="flex items-center">
				Simply click on the trash can icon <TrashCanRegular class="w-4 h-4 ml-1 mr-1" /> and confirm
				the deletion.
			</p>
		</div>
		<div class="mt-[20px]">
			<p class="font-bold">Want to change your theme?</p>
			<p>
				Quick shortcut is at the bottom-right of your page. You can change your theme whenever you
				want.
			</p>
		</div>
		<button
			class="justify-center mt-3 px-4 py-2 rounded-lg h-[40px] border bg-primary-600 border-solid border-[#EF562F]
	  hover:bg-slate-700 hover:border-slate-700 shadow-md font-bold text-white inline-flex items-center"
			on:click={toggleHelp}>Close</button
		>
	</div>
</div>

<div
	class="border-2 border-solid border-gray-200 bg-gray-200 dark:border-slate-900 dark:bg-slate-900 fixed right-0 bottom-0 rounded-l-lg"
>
	<DarkMode class="h-[60%]"></DarkMode>
</div>

<div class="flex flex-row justify-between h-30 w-[100%] bg-gray-900">
	<div class="justify-start items-center ml-4 h-[100%] mt-auto mb-auto">
		<button
			class="justify-center px-4 py-2 hover:bg-slate-700 bg-slate-800 text-white rounded-lg inline-flex items-center"
			on:click={() => (window.location.href = `/client/dashboard/customer/${vendorid}/`)}
		>
			<ArrowLeftOutline class="h-5 w-5" />
			<span class="hidden md:flex md:visible ml-2">Menu</span>
		</button>
	</div>

	<div class="textcontainer flex flex-col lg:-ml-24 md:-ml-24 text-center">
		<div class="header font-bold text-3xl text-white w-full h-12 flex items-center justify-center">
			<h1>Hello, {customerData.customername}</h1>
		</div>

		<div class="subheader text-lg text-white w-full h-12 flex items-center justify-center">
			<h1>Your cart</h1>
		</div>
	</div>

	<div class="justify-start items-center h-[100%] mt-auto mb-auto">
		<button
			class="flex justify-center items-center hover:bg-slate-700 bg-slate-800 rounded-lg px-[14px] py-[6px] text-white mr-4"
			on:click={toggleHelp}
		>
			<QuestionCircleOutline class="h-6 w-6" />
		</button>
	</div>
</div>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-600">
	<div class="xlcontainer flex flex-col justify-between min-h-[100vh]">
		<div class="maincontainer">
			<div class="main dark:text-white">
				<div class="text-[16px] vendor p-5 font-semibold">
					Vendor: {vendorData.businessname}
				</div>
				<div class="flex flex-col p-5 lg:text-lg text-sm">
					<div
						class="titlegrid grid grid-cols-[4fr,4fr,2fr,1fr] gap-5 place-items-left p-1 font-semibold"
					>
						<div class="itemname col-span-1 min-w-[80px]">Item Name</div>
						<div class="remark col-span-1 min-w-[100px]">Remark</div>
						<div class="price col-span-1 min-w-[40px]">Price</div>
						<div class="col-span-1 min-w-[50px]"></div>
					</div>
					<hr style="border-top: 2px solid rgba(0, 0, 0, 1);" />
					{#if orderItems}
						{#each orderItems as item}
							<div class="itemcontainer flex flex-col">
								<div class="titlegrid grid grid-cols-[4fr,4fr,2fr,1fr] gap-5 place-items-left p-1">
									<div class="itemname col-span-1 min-w-[80px] flex flex-row items-center">
										{item.itemname}
									</div>
									<div
										class="remark text-justify col-span-1 min-w-[100px] flex flex-row items-center"
										style="word-wrap: break-word;"
									>
										{#if item.remark}
											{item.remark}
										{:else}
											-
										{/if}
									</div>
									<div class="third flex flex-row items-center">
										<div class="price col-span-1 min-w-[40px]">
											RM {Number(item.itemprice).toFixed(2)}
										</div>
									</div>
									<Button
										color="none"
										on:click={() => {
											popupModal = true;
											selectedItem = item.orderitemid;
										}}><TrashCanRegular class="dark:text-red-400 text-red-600 h-5 w-5" /></Button
									>
								</div>
							</div>
							<hr style="border-top: 2px solid rgba(0, 0, 0, 0.2);" />
						{/each}
					{/if}
				</div>
			</div>
		</div>
		<div class="bottom p-[4rem] flex flex-col items-end dark:text-white">
			<div class="totalprice text-[18px]">Subtotal: RM {Number(pricetotal).toFixed(2)}</div>
			<div class="text-[18px]">Delivery fee: RM {Number(riderComm).toFixed(2)}</div>
			<div class="tax text-[18px]">Sales Tax (8%): RM {Number(salestax).toFixed(2)}</div>
			<div class="text-xl font-bold mb-3">Total: RM {Number(ordertotalprice).toFixed(2)}</div>
			{#if orderItems && orderItems.length > 0}
				<Button href="/client/dashboard/customer/{vendorid}/cart/checkout">Checkout</Button>
			{:else}
				<Button disabled>Checkout</Button>
			{/if}
		</div>
	</div>
</div>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this item from your cart?
		</h3>
		<Button
			color="red"
			class="me-2"
			on:click={() => {
				deleteOrderItem(selectedItem);
			}}>Yes</Button
		>
		<Button color="alternative" on:click={() => (popupModal = false)}>No</Button>
	</div>
</Modal>

<style>
	.block {
		display: block;
	}
	.bg-semi-transparent {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
