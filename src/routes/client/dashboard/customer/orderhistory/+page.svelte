<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { AccordionItem, Accordion, Button, DarkMode, StepIndicator } from 'flowbite-svelte';
	import { ArrowLeftOutline, CartOutline } from 'flowbite-svelte-icons';
	let popupModal = false;

	let userData;
	/**
	 * @type {any}
	 */
	let customerData = [];
	/**
	 * @type {string | undefined}
	 */
	let user_id; //Customer ID
	/**
	 * @type {any}
	 */
	let orders = [];
	/**
	 * @type {any}
	 */
	let orderitems = [];

	let customerid;

	let currentStep = 1;
	let colour = 'default';

	let steps = [
		'Your Order has been received by the Vendor',
		'Vendor is cooking your order...',
		'On Delivery',
		'Delivered'
	];

	onMount(async () => {
		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		customerData = await fetchCustomerData();
		customerid = customerData.customerid;
		orders = await fetchOrders();
		// for (let order of orders) {
		//     console.log(order);
		// 	order.orderitems = await fetchOrderItems(order.orderid);
		// }
		console.log(customerData);
		console.log(orders);

		
		const channels = supabaseClient
			.channel('custom-update-channel')
			.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sale', filter: `customerid=eq.${customerid}` }, (payload) => {
				window.location.reload();
			})
			.subscribe();
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

	async function fetchOrders() {
		console.log('fetching orders');
		const { data: order, error } = await supabaseClient
			.from('cusorder')
			.select('*, orderitem(*), sale(*, vendor(*))')
			.eq('customerid', customerData.customerid)
			.eq('cartstatus', 'completed')
			.order('ordergenerated', { ascending: false });

		if (error) {
			console.error('Error fetching orders: ', error);
		} else if (order && order.length > 0) {
			orders = order;
		}
		console.log('done fetching');
		return order;
	}

	//export let data;
</script>

<div class="page-container min-h-[100vh] overflow-x-hidden dark:bg-gray-600">
	<div class="header h-16 bg-gray-900 px-4 flex flex-row justify-between">
		<Button pill={true} outline={true} class="my-4" on:click={() => (window.history.back())}>
			<ArrowLeftOutline class="w-4 h-4 text-white" />
		</Button>
		<div class="flex flex-col items-center">
			<div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
				<h1>Hello, {customerData.customername}</h1>
			</div>

			<div class="text-base text-white w-full h-8 flex items-center justify-center">
				<h1>Welcome to Your Order History</h1>
			</div>
		</div>
		<div class="rightside gap-3 flex flex-row">
			<DarkMode class="h-[60%] mt-auto mb-auto"></DarkMode>
		</div>
	</div>
	<div class="text-black dark:text-white w-[100%]">
		{#each orders as order}
			<Accordion>
				<AccordionItem class="text-black dark:text-white w-[100%]">
					<span slot="header">{order.orderid}</span>
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
								<td class="px-4 py-2">{orderitem.remark}</td>
								<td class="px-4 py-2">RM {orderitem.itemprice}</td>
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
							width: 10px;
							height: 10px;
							background-color: {sale.vendororderstatus === null
											? 'grey'
											: sale.vendororderstatus === 'pending'
												? 'yellow'
												: sale.vendororderstatus === 'completed'
													? 'green'
													: sale.vendororderstatus === 'failed'
														? 'red'
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
							width: 10px;
							height: 10px;
							background-color: {sale.deliverystatus === null
											? 'grey'
											: sale.deliverystatus === 'pending'
												? 'yellow'
												: sale.deliverystatus === 'completed'
													? 'green'
													: sale.deliverystatus === 'failed'
														? 'red'
														: 'gray'};
							margin-right: 5px;
						"
									></span>
									Delivery Status: {sale.deliverystatus.charAt(0).toUpperCase() +
										sale.deliverystatus.slice(1)}
								</p>
							{/each}
						</div>
						<div class="track m-4">
							<span class="">Delivery Status:</span>
							<div class="trackingsection bg-black text-white p-6 rounded-xl ml-auto mr-auto">
								{#await determineStep(order.sale[0].saleid)}
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
