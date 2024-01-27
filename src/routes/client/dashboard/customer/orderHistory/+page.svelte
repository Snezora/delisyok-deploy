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
			.select('*, orderitem(*), sale(*)')
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
					<p class="mb-2 text-gray-600 dark:text-gray-500 flex flex-col gap-1">
						{#each order.sale as sale}
							<span>Receipt generated: {sale.receiptgenerated}</span>
						{/each}

						{#each order.sale as sale}
							<span>
								Sale id: {sale.saleid}
							</span>
						{/each}
					</p>

					<hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 10px 0;" />

					Order items:
					{#each order.orderitem as orderitem}
						<div style="display: flex; justify-content: space-between; margin-left: 20px">
							{orderitem.itemname}
							<span>RM{orderitem.itemprice}</span>
						</div>
					{/each}

					<hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 10px 0;" />
					<div>
						{#each order.sale as sale}
							<span>Total price: RM{sale.totalamount}</span>
						{/each}
					</div>

					<hr style="border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 10px 0;" />

					<div>
						{#each order.sale as sale}
						<p>
							Delivery address: {sale.deliveryaddress}
						</p>
						<p>
							<span style="
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        background-color: {sale.vendororderstatus === null ? 'grey' :
						sale.vendororderstatus === 'pending' ? 'yellow' :
						sale.vendororderstatus === 'completed' ? 'green' :
						sale.vendororderstatus === 'failed' ? 'red': 'gray'};
                        margin-right: 5px;
                    "></span>
							Order status: {sale.vendororderstatus}
						</p>
						<p>
							<span style="
                        display: inline-block;
                        width: 10px;
                        height: 10px;
                        background-color: {sale.deliverystatus === null ? 'grey' :
						sale.deliverystatus === 'pending' ? 'yellow' :
						sale.deliverystatus === 'completed' ? 'green' :
						sale.deliverystatus === 'failed' ? 'red': 'gray'};
                        margin-right: 5px;
                    "></span>
							Delivery status: {sale.deliverystatus}
						</p>
						{/each}
					</div>
				</AccordionItem>
			</Accordion>
		{/each}
	</div>
</div>
