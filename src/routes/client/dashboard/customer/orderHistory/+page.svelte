<script>
	/** @type {import('./$types').PageData} */
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	let popupModal = false;

	let userData;
	/**
	 * @type {any}
	 */
	let customerData;
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
		console.log('im here');

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

	async function fetchOrders() {
		console.log('fetching orders');
		const { data: order, error } = await supabaseClient
			.from('cusorder')
			.select('*, orderitem(*)')
			.eq('customerid', customerData.customerid)
			.eq('cartstatus', 'completed');

		if (error) {
			console.error('Error fetching orders: ', error);
		} else if (order && order.length > 0) {
			orders = order;
		}
		console.log('done fetching');
		return order;
	}

	/**
	 * @param {any} orderid
	 */
	async function fetchOrderItems(orderid) {
		console.log('fetching order items');
		console.log(orderid);
		const { data: orderitem, error } = await supabaseClient
			.from('orderitem')
			.select('*')
			.eq('orderid', orderid);

		if (error) {
			console.error('Error fetching order items: ', error);
		} else if (orderitem && orderitem.length > 0) {
            console.log('something',orderitems);
			orderitems = orderitem;
		}
		console.log('done fetching');
        console.log(orderitems.orderitemid);
		return orderitem || [];
	}

	//export let data;
</script>

<div class="page-container min-h-[100vh] overflow-x-hidden">
	<div class="flex flex-col items-center h-16 bg-gray-900">
		<div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
			<h1>Hi, Shopper.</h1>
		</div>

		<div class="text-base text-white w-full h-8 flex items-center justify-center">
			<h1>What will your next order be?</h1>
		</div>
	</div>
	<div>
		{#each orders as order}
			<Accordion>
				<AccordionItem>
					<span slot="header">{order.orderid}</span>
					<p class="mb-2 text-gray-500 dark:text-gray-400 flex flex-col gap-1">
						{#each order.orderitem as item}
							{item.itemname}
							<hr />
						{/each}
					</p>
					<p class="text-gray-500 dark:text-gray-400">
						Check out this guide to learn how to <a
							href="/"
							target="_blank"
							rel="noreferrer"
							class="text-blue-600 dark:text-blue-500 hover:underline"
						>
							get started
						</a>
						and start developing websites even faster with components on top of Tailwind CSS.
					</p>
				</AccordionItem>
			</Accordion>
		{/each}
	</div>
</div>
