<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { Button, Modal, DarkMode, Input, Textarea, Label } from 'flowbite-svelte';
	import { ExclamationCircleOutline, ArrowLeftOutline, PenSolid } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import SidebarCustomer from '../../../SidebarCustomer.svelte';
	import { goto } from '$app/navigation';
	let sidebarOpen = false;
	let popupModal = false;

	const vendorid = $page.params.vendorMenu;

	let userData;
	/**
	 * @type {never[]}
	 */
	let customerData = [];
	let user_id;
	/**
	 * @type {any}
	 */
	let customerid;

	/**
	 * @type {never[]}
	 */
	let vendorData = [];
	/**
	 * @type {any[]}
	 */
	let cart = [];
	/**
	 * @type {any[]}
	 */
	let orderItems = [];
	/**
	 * @type {any}
	 */
	let deliveryaddress;
	/**
	 * @type {string}
	 */
	let salestax;
	/**
	 * @type {number}
	 */
	let riderComm;
	/**
	 * @type {any}
	 */
	let ordertotalprice;
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
	let vendorearn;

	/**
	 * @type {any}
	 */
	let nameoncard;
	/**
	 * @type {any}
	 */
	let cardnumber;
	/**
	 * @type {any}
	 */
	let cardexpiry;
	/**
	 * @type {any}
	 */
	let cvv;
	let datenow;

	async function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	onMount(async () => {
		customerData = await fetchCustomerData();
		console.log(customerData);
		customerid = customerData.customerid;
		vendorData = await getVendor();
		console.log(vendorData);
		cart = await fetchCart();
		console.log(cart);
		orderItems = cart.orderitem;
		console.log(orderItems);
		deliveryaddress = toAddress(
			customerData.customeraddressl1,
			customerData.customeraddressl2,
			customerData.customeraddresscity,
			customerData.customeraddressposcode,
			customerData.customeraddressstate
		);
		console.log(deliveryaddress);

		orderItems.forEach((element) => {
			addPrices(element.itemprice);
		});
		console.log(pricetotal);
		salestax = (pricetotal * 0.08).toFixed(2);
		console.log(salestax);
		riderComm = 5;
		ordertotalprice = (pricetotal + riderComm + parseFloat(salestax)).toFixed(2);
		vendorearn = Math.round(ordertotalprice * 0.7);
		console.log(vendorearn);
	});

	/**
	 * @param {any} price
	 */
	async function addPrices(price) {
		pricelist.push(price);
		pricetotal = pricelist.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

		return pricetotal;
	}

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
		}
		return customerData;
	}

	/**
	 * @param {any} addressl1
	 * @param {any} addressl2
	 * @param {any} addresscity
	 * @param {any} addressposcode
	 * @param {any} addressstate
	 */
	function toAddress(addressl1, addressl2, addresscity, addressposcode, addressstate) {
		let address = `${addressl1}, ${addresscity}, ${addressposcode}, ${addressstate}`;

		if (addressl2) {
			address = `${addressl1}, ${addressl2}, ${addresscity}, ${addressposcode}, ${addressstate}`;
		}

		return address;
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
			.select('*, orderitem(*)')
			.eq('customerid', customerid)
			.eq('cartstatus', 'unpaid')
			.order('ordergenerated', { ascending: false });

		if (error) {
			console.error('Error fetching cart: ', error);
		} else {
			return data[0];
		}
	}

	async function uploadCardData() {
		const { error } = await supabaseClient.from('sale').insert([
			{
				receiptgenerated: new Date().toISOString(),
				paymentmethod: 'Card',
				paymentstatus: 'Completed',
				totalamount: ordertotalprice,
				ridercomission: riderComm,
				vendorearning: vendorearn,
				orderid: cart.orderid,
				deliveryaddress,
				nameoncard,
				cardnumber,
				cardexpiry,
				cvv,
				vendororderstatus: 'pending',
				deliverystatus: 'pending',
				vendorid: vendorid
			}
		]);

		if (error) {
			console.error('Error uploading the data: ', error);
		}

		const { error: error2 } = await supabaseClient
			.from('cusorder')
			.update({ cartstatus: 'completed' })
			.eq('orderid', cart.orderid);

		if (error2) {
			console.error('Error updating cart status: ', error2);
		} else {
			alert('Your Order has been Submitted. Please check order history for updates!');
			setTimeout(() => {
				window.location.href = '/client/dashboard/customer/orderhistory';
			}, 2000); // Delay the redirection for 2000 milliseconds (2 seconds)		
		}
	}

	async function uploadCashData() {
		cardnumber = 0;
		cardexpiry = '-';
		cvv = 0;
		nameoncard = '-';

		let date = new Date();
		const { error } = await supabaseClient.from('sale').insert([
			{
				receiptgenerated: new Date().toISOString(),
				paymentmethod: 'Cash',
				paymentstatus: 'Completed',
				totalamount: ordertotalprice,
				ridercomission: riderComm,
				vendorearning: vendorearn,
				orderid: cart.orderid,
				deliveryaddress,
				nameoncard,
				cardnumber,
				cardexpiry,
				cvv,
				vendororderstatus: 'pending',
				deliverystatus: 'pending',
				vendorid: vendorid
			}
		]);

		if (error) {
			console.error('Error uploading the data: ', error);
		}

		const { error: error2 } = await supabaseClient
			.from('cusorder')
			.update({ cartstatus: 'completed' })
			.eq('orderid', cart.orderid);

		if (error2) {
			console.error('Error updating cart status: ', error2);
		} else {
			alert('Your Order has been Submitted. Please check order history for updates!');
			setTimeout(() => {
				window.location.href = '/client/dashboard/customer/orderhistory';
			}, 2000); // Delay the redirection for 2000 milliseconds (2 seconds)
		}
	}

	//export let data;
</script>

<div class="fixed z-10">
	{#if sidebarOpen}
		<div class="fixed">
			<SidebarCustomer />
		</div>
	{/if}
</div>

<div class="page-container min-h-[100vh] bg-white dark:bg-gray-500">
	<div class="header h-16 bg-gray-900 px-4 flex flex-row justify-between">
		<Button pill={true} outline={true} class="my-4" on:click={() => window.history.back()}>
			<ArrowLeftOutline class="w-4 h-4 text-white" />
		</Button>
		<div class="flex flex-col items-center mt-auto mb-auto">
			<div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
				<h1>Checkout</h1>
			</div>
		</div>
		<div class="rightside gap-3 flex flex-row">
			<DarkMode class="h-[60%] mt-auto mb-auto"></DarkMode>
		</div>
	</div>
	<div class="absolute z-10">
		<button
			class="z-10 w-[50px] h-[50px] transition-[width] duration-[0.3s] ease-[ease-in-out] border bg-[#f8f9fa] border-solid border-[#f8f9fa] hover:bg-slate-300 {sidebarOpen
				? 'translate-x-[200px] translate-y-[-65px] fixed'
				: ''}"
			on:click={toggleSidebar}
		>
			Menu
		</button>
	</div>
	<div
		class="maincontainer flex flex-wrap w-[100%] mt-[50px] justify-items-center lg:pl-[60px] md:pl-[60px] md:justify-between lg:justify-between sm:justify-center pb-8 dark:text-white gap-8"
	>
		<div class="leftside flex flex-col items-center md:items-start gap-5 flex-1 min-w-[320px]">
			<div class="name text-xl font-bold">
				Vendor: {vendorData.businessname}
			</div>
			<div class="deliver flex flex-wrap gap-3 mb-3">
				<div class="text flex self-center">Delivery Address:</div>
				<div class="area w-[300px]">
					<Input type="text" placeholder="Address" size="md" bind:value={deliveryaddress}>
						<PenSolid slot="right" class="w-5 h-5" />
					</Input>
				</div>
			</div>
			<hr color="black" class="w-[100%] border-black" />
			<div class="titles md:text-xl lg:text-xl font-bold w-[100%]">
				<div class="titlegrid grid grid-cols-3 place-items-center font-extrabold">
					<div class="itemname">Item Name</div>
					<div class="remark">Remark</div>
					<div class="price">Price</div>
				</div>
			</div>
			<hr color="black" class="w-[100%] border-black" />
			{#if orderItems.length == 0}
				<div
					class="text text-2xl text-center w-[100%] h-[100%] flex flex-col justify-center font-bold"
				>
					No Items. Please add items to your cart.
				</div>
			{:else}
				{#each orderItems as item}
					<div class="itemcontainer flex flex-col w-[100%] mt-5">
						<div class=" grid grid-cols-3 place-items-center">
							<div class="itemname">{item.itemname}</div>
							<div class="remark">{item.remark}</div>
							<div class="third flex flex-row items-center">
								<div class="price">RM {item.itemprice}</div>
							</div>
						</div>
					</div>
					<hr color="black" class="w-[95%] self-center mt-3 border-gray-600" />
				{/each}
			{/if}
			<hr color="black" class="w-[100%] border-black" />
			<div class="bottom pt-[4rem] pr-[4rem] flex flex-col self-end items-end dark:text-white">
				<div class="totalprice text-[18px]">Subtotal: RM {pricetotal}</div>
				<div class="text-[18px]">Delivery fee: RM {riderComm}</div>
				<div class="tax text-[18px]">Sales Tax (8%): RM {salestax}</div>
				<div class="text-xl font-bold mb-3">Total: RM {ordertotalprice}</div>
			</div>
		</div>
		<div
			class="rightside flex flex-col md:items-start lg:items-start items-center sm:pl-auto sm:pr-auto w-[100vh] md:w-auto lg:w-auto flex-2"
		>
			<div
				class="rectanglecontainer bg-gray-600 text-white w-[90%] self-center items-center rounded p-5"
			>
				<div class="filler w-[100%] flex flex-col items-center font-bold text-xl gap-4">
					<div class="cardtitle text-center">Please fill in your card details</div>
					<div class="carddetails text-white flex flex-col gap-2">
						<div>
							<Label for="first_name" class="mb-1 text-white">Name on Card</Label>
							<Input
								type="text"
								id="fullname"
								placeholder="John Cena"
								required
								class="dark:bg-white dark:text-black"
								bind:value={nameoncard}
							/>
						</div>
						<div>
							<Label for="card_no" class="mb-1 text-white">Card Number</Label>
							<Input
								type="number"
								id="card_no"
								placeholder="1234567890123456"
								pattern="[0-9]{16}"
								required
								class="dark:bg-white dark:text-black"
								bind:value={cardnumber}
							/>
						</div>
						<div>
							<Label for="exp" class="mb-1 text-white">Card Expiry Date</Label>
							<Input
								type="text"
								id="exp"
								placeholder="MM/YY"
								pattern="[0-9]{2}/[0-9]{2}"
								required
								class="dark:bg-white dark:text-black"
								bind:value={cardexpiry}
							/>
						</div>
						<div>
							<Label for="cvv" class="mb-1 text-white">CVV</Label>
							<Input
								type="number"
								id="exp"
								placeholder="000"
								pattern="[0-9]{3}"
								required
								class="dark:bg-white dark:text-black"
								bind:value={cvv}
							/>
						</div>
					</div>
					<div class="totalprice">Total: RM {ordertotalprice}</div>
					{#if orderItems.length == 0}
						<Button class="w-[100%] rounded-2xl text-[18px] pt-2" disabled>Pay With Card</Button>
						<hr class="w-[100%]" />
						<Button class="w-[100%] rounded-2xl text-[18px] pt-2" disabled>Pay With Cash</Button>
					{:else}
						<Button class="w-[100%] rounded-2xl text-[18px] pt-2" on:click={uploadCardData}
							>Pay With Card</Button
						>
						<hr class="w-[100%]" />
						<Button class="w-[100%] rounded-2xl text-[18px] pt-2" on:click={uploadCashData}
							>Pay With Cash</Button
						>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.titleBar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 30px;
		background-color: orange;
	}
	.topSpace {
		top: 0;
		left: 0;
		width: 100%;
		height: 30px;
	}
</style>
