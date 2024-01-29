<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { AccordionItem, Accordion, Button, DarkMode } from 'flowbite-svelte';
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

	onMount(async () => {
		console.log('im here start');
		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		console.log('you are in OH');
		customerData = await fetchCustomerData();
		orders = await fetchOrders();
		// for (let order of orders) {
		//     console.log(order);
		// 	order.orderitems = await fetchOrderItems(order.orderid);
		// }
		console.log(customerData);
		console.log(orders);
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
		}
		return customerData;
	}

	async function fetchOrders() {
		console.log('fetching orders');
		const { data: order, error } = await supabaseClient
			.from('cusorder')
			.select('*, orderitem(*), sale(*)')
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
	<div class="text-black dark:text-white">
		{#each orders as order}
			<Accordion>
				<AccordionItem class="text-black dark:text-white">
					<span slot="header">{order.orderid}</span>
					<div class="container text-black dark:text-white">
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
						{#each order.orderitem as orderitem}
							<div style="display: flex; justify-content: space-between; margin-left: 20px">
								{orderitem.itemname}
								<span>RM {orderitem.itemprice}</span>
							</div>
						{/each}

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
						<Button class="mt-3" href="/client/orders/{order.orderid}">View & Track Order</Button>
					</div>
				</AccordionItem>
			</Accordion>
		{/each}
	</div>
</div>
