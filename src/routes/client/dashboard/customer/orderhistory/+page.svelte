<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { AccordionItem, Accordion, DarkMode, StepIndicator } from 'flowbite-svelte';
	import { ArrowLeftOutline, QuestionCircleOutline } from 'flowbite-svelte-icons';

	/**
	 * @type {any}
	 */
	let customerData = [];
	/**
	 * @type {string | undefined}
	 */
	let user_id;
	/**
	 * @type {any}
	 */
	let orders = [];

	let customerid;

	let steps = [
		'Your Order has been received by the Vendor',
		'Vendor is cooking your order...',
		'On Delivery',
		'Delivered'
	];

	onMount(async () => {
		console.log('Start Test: Render Order History Page');

		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		console.log('Fetch Test: User ID ' + user_id);

		console.log('Fetch Test: Customer Data Array');
		customerData = await fetchCustomerData();
		console.log(customerData);

		console.log('Fetch Test: Populate Variable');
		customerid = customerData.customerid;

		console.log('Fetch Test: Order Array, Sales Array, Order Item Array');
		orders = await fetchOrders();
		console.log(orders);

		const channels = supabaseClient
			.channel('custom-update-channel')
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'sale', filter: `customerid=eq.${customerid}` },
				(payload) => {
					window.location.reload();
				}
			)
			.subscribe();
			console.log('Render Test: Completed');
	});

	/**
	 * @param {any} saleid
	 */
	async function determineStep(saleid) {
		const { data: orderdeets, error } = await supabaseClient
			.from('sale')
			.select('*, cusorder(*)')
			.eq('saleid', saleid)
			.single();

		if (error) {
			console.error('Error fetching order details: ', error);
		} else {
			if (orderdeets.vendororderstatus == 'pending' && orderdeets.deliverystatus != 'cancelled') {
				return 1;
			} else if (
				(orderdeets.vendororderstatus == 'ongoing' && orderdeets.deliverystatus != 'cancelled') ||
				(orderdeets.vendororderstatus == 'completed' && orderdeets.deliverystatus == 'pending')
			) {
				return 2;
			} else if (
				orderdeets.deliverystatus == 'ongoing' &&
				orderdeets.vendororderstatus == 'completed'
			) {
				return 3;
			} else if (
				orderdeets.vendororderstatus == 'completed' &&
				orderdeets.deliverystatus == 'completed'
			) {
				return 4;
			} else {
				return 5;
			}
		}
	}

	//Data Structure: Customer Data Array
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
		}
		return customerData;
	}

	//Data Structure: Order Array, Sale Array, Order Item Array
	async function fetchOrders() {
		const { data: order, error } = await supabaseClient
			.from('cusorder')
			.select('orderid, ordergenerated, cartstatus, orderitem(*), sale(*, vendor(*))')
			.eq('customerid', customerData.customerid)
			.eq('cartstatus', 'completed')
			.order('ordergenerated', { ascending: false });

		if (error) {
			console.error('Error fetching orders: ', error);
		} else if (order && order.length > 0) {
			orders = order;
		}
		return order;
	}

	//export let data;

	let showHelp = false;

	function toggleHelp() {
		showHelp = !showHelp;
	}
</script>

<div
	class="border-2 border-solid border-gray-200 bg-gray-200 dark:border-slate-900 dark:bg-slate-900 fixed right-0 bottom-0 rounded-l-lg"
>
	<DarkMode class="h-[60%]"></DarkMode>
</div>

<div
	class="{showHelp
		? 'block'
		: 'hidden'} z-20 fixed inset-0 bg-semi-transparent flex items-center justify-center"
>
	<div class="p-4 bg-white rounded shadow-lg">
		<h2 class="text-2xl font-bold mb-2">Help</h2>
		<div class="mt-[20px]">
			<p class="font-semibold text-xl">Welcome to the Customer Client Page.</p>
			<p>
				Here you can find the list of vendors. Click on the desired vendor cards to view their menu.
			</p>
			<p></p>
		</div>

		<div class="mt-[20px]">
			<p class="font-bold">Want to track your order?</p>
			<p>
				Just select an order number and you will see your order details. Plus, you get to track your
				order!
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

<div class="page-container min-h-[100vh] overflow-x-hidden dark:bg-gray-600">
	<div class="flex flex-row justify-between h-30 w-[100%] bg-gray-900">
		<div class="justify-start items-center ml-4 h-[100%] mt-auto mb-auto">
			<button
				class="justify-center px-4 py-2 hover:bg-slate-700 bg-slate-800 text-white rounded-lg inline-flex items-center"
				on:click={() => (window.location.href = '/client/dashboard/customer')}
			>
				<ArrowLeftOutline class="h-5 w-5" />
				<span class="hidden md:flex md:visible ml-2">Vendor List</span>
			</button>
		</div>

		<div class="textcontainer flex flex-col lg:-ml-24 md:-ml-24 text-center">
			<div class="font-bold text-3xl text-white w-full h-12 flex items-center justify-center">
				<h1>Hello, {customerData.customername}</h1>
			</div>

			<div class="text-lg text-white w-full h-12 flex items-center justify-center">
				<h1>Your order history</h1>
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
	<div class="text-black dark:text-white w-[100%]">
		{#each orders as order}
			<Accordion>
				<AccordionItem class="text-black dark:text-white w-[100%]">
					<span slot="header">Order ID: {order.orderid}</span>
					<div class="container text-black dark:text-white w-[100%]">
						<p class="mb-2 text-black dark:text-white flex flex-col gap-1">
							{#each order.sale as sale}
								<span
									>Receipt Generated: {new Date(sale.receiptgenerated)
										.toLocaleString('en-GB', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
											hour: '2-digit',
											minute: '2-digit',
											second: '2-digit'
										})
										.replace(',', '')}</span
								>
							{/each}

							{#each order.sale as sale}
								<span>
									Sale ID: {sale.saleid}
								</span>
							{/each}
						</p>

						<hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 10px 0;" />

						Order items:
						<table class="w-full table-auto">
							<thead>
								<tr class="text-left">
									<th class="px-4 py-2">Item Name</th>
									<th class="px-4 py-2">Remark</th>
									<th class="px-4 py-2">Item Price</th>
								</tr>
							</thead>
							<tbody>
								{#each order.orderitem as orderitem}
									<tr>
										<td class="px-4 py-2">{orderitem.itemname}</td>
										<td class="px-4 py-2">
											{#if orderitem.remark}
												{orderitem.remark}
											{:else}
												-
											{/if}</td
										>
										<td class="px-4 py-2">RM {Number(orderitem.itemprice).toFixed(2)}</td>
									</tr>
								{/each}
							</tbody>
						</table>

						<hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 10px 0;" />
						<div>
							{#each order.sale as sale}
								<span>Total price: RM {sale.totalamount}</span>
							{/each}
						</div>

						<hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 10px 0;" />

						<div>
							{#each order.sale as sale}
								<p>
									Vendor: {sale.vendor.businessname}
								</p>
								<p>
									Delivery Address: {sale.deliveryaddress}
								</p>
								<p>
									<span
										style="
							display: inline-block;
							width: 20px;
							height: 12px;
							background-color: {sale.vendororderstatus === 'completed'
											? 'green'
											: sale.vendororderstatus === 'failed'
												? 'red'
												: sale.vendororderstatus === 'ongoing'
												? 'yellow'
												: 'gray'};
							margin-right: 5px;
						"
									></span>
									Order Status: {sale.vendororderstatus.charAt(0).toUpperCase() +
										sale.vendororderstatus.slice(1)}
								</p>
								<p>
									<span
										style="
							display: inline-block;
							width: 20px;
							height: 12px;
							background-color: {sale.deliverystatus === 'completed'
											? 'green'
											: sale.deliverystatus === 'failed'
												? 'red'
												: sale.deliverystatus === 'ongoing'
												? 'yellow'
												: 'grey'};
							margin-right: 5px;
						"
									></span>
									Delivery Status: {sale.deliverystatus.charAt(0).toUpperCase() +
										sale.deliverystatus.slice(1)}
								</p>
							{/each}
						</div>
						<div class="track mt-4">
							<span class="">Delivery Status:</span>
							<div class="trackingsection bg-black text-white p-6 rounded-xl ml-auto mr-auto">
								{#await determineStep(order?.sale?.[0]?.saleid)}
									<div>Loading...</div>
								{:then stepResult}
									{#if stepResult == 1 || stepResult == 2 || stepResult == 3}
										<StepIndicator currentStep={stepResult} {steps} color="blue" />
									{:else if stepResult == 4}
										<StepIndicator currentStep={stepResult} {steps} color="green" />
									{:else if stepResult == 5}
										<StepIndicator
											currentStep={1}
											steps={['Your order has been cancelled. Please contact customer service.']}
											color="red"
										/>
									{/if}
								{:catch error}
									<div>Error: {error.message}</div>
								{/await}
							</div>
						</div>
					</div>
				</AccordionItem>
			</Accordion>
		{/each}
	</div>
</div>

<style>
	.block {
		display: block;
	}
	.bg-semi-transparent {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
