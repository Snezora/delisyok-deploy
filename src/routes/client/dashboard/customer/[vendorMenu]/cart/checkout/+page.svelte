<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { Button, Modal, DarkMode, Input, Textarea, Label } from 'flowbite-svelte';
	import {
		ExclamationCircleOutline,
		ArrowLeftOutline,
		PenSolid,
		QuestionCircleOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/stores';

	const vendorid = $page.params.vendorMenu;

	/**
	 * @type {any}
	 */
	let customerData = '';

	let user_id;

	/**
	 * @type {any}
	 */
	let customerid;

	/**
	 * @type {any}
	 */
	let vendorData = '';

	/**
	 * @type {any}
	 */
	let cart = '';

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

	onMount(async () => {
		console.log('Start Test: Render Checkout Page');

		console.log('Fetch Test: Customer Data');
		customerData = await fetchCustomerData();
		console.log(customerData);

		console.log('Initialisation Test: Populating Variable');
		customerid = customerData.customerid;
		deliveryaddress = toAddress(
			customerData.customeraddressl1,
			customerData.customeraddressl2,
			customerData.customeraddresscity,
			customerData.customeraddressposcode,
			customerData.customeraddressstate
		);
		console.log(deliveryaddress);

		console.log('Fetch Test: Vendor Data');
		vendorData = await getVendor();
		console.log(vendorData);

		console.log('Fetch Test: Cart Data');
		cart = await fetchCart();
		console.log(cart);

		console.log('Fetch Test: Order Item Array from Cart Data');
		orderItems = cart.orderitem;
		console.log(orderItems);

		console.log('Calculation Test: Calculate total');
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
		console.log(ordertotalprice);

		console.log('Render Test: Completed');
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

	//Validation
	function validateaddress() {
		const isValid = /^[a-zA-Z0-9-,. ()\\\\]+$/.test(deliveryaddress);
		if (!deliveryaddress || !isValid) {
			alert('Please enter an address for delivery purposes.');
			return false;
		}
		return true;
	}

	function validNameOnCard() {
		const isValidName = /^[A-Za-z\s]+$/.test(nameoncard);
		if (!isValidName || !nameoncard) {
			alert('Please enter a valid name for the card holder.');
		}
		return isValidName;
	}

	function validateCardNumber() {
		const isValidCard = /^\d{16,19}$/.test(cardnumber);
		if (!isValidCard || !cardnumber) {
			alert('Please enter a valid card number.');
		}
		return isValidCard;
	}

	function validateCardExpiry() {
		if (!cardexpiry){
			alert('Please enter a valid card expiry. Expired card is not accepted.');
			return false;
		}
		const currentMonth = ('0' + (new Date().getMonth() + 1)).slice(-2);
		const currentYear = new Date().getFullYear().toString().slice(-2);
		const isValidExpiry = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardexpiry);
		const [expiryMonth, expiryYear] = cardexpiry.split('/');
		if (
			!isValidExpiry ||
			expiryYear < currentYear ||
			(expiryYear === currentYear && expiryMonth <= currentMonth)
		) {
			alert('Please enter a valid card expiry. Expired card is not accepted.');
			return false;
		}
		return true;
	}

	function validateCVV() {
		const isValidCVV = /^\d{3}$/.test(cvv);
		if (!isValidCVV || !cvv) {
			alert('Please enter a valid CVV.');
		}
		return isValidCVV;
	}

	async function uploadCardData() {
		if (
			validateaddress() &&
			validNameOnCard() &&
			validateCardNumber() &&
			validateCardExpiry() &&
			validateCVV()
		) {
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
				window.location.href = '/client/dashboard/customer/orderhistory';
			}
		}
	}

	async function uploadCashData() {
		if (validateaddress()) {
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
				window.location.href = '/client/dashboard/customer/orderhistory';
			}
		}
	}

	let showHelp = false;

	function toggleHelp() {
		showHelp = !showHelp;
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
			<p class="font-bold">Have another delivery address in mind?</p>
			<p>You can simply edit the delivery address in the text box.</p>
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

<div class="page-container min-h-[100vh] bg-white dark:bg-stone-600">
	<div class="flex flex-row justify-between h-30 w-[100%] bg-gray-900">
		<div class="justify-start items-center ml-4 h-[100%] mt-auto mb-auto">
			<button
				class="justify-center px-4 py-2 hover:bg-slate-700 bg-slate-800 text-white rounded-lg inline-flex items-center"
				on:click={() => (window.location.href = `/client/dashboard/customer/${vendorid}/cart/`)}
			>
				<ArrowLeftOutline class="h-5 w-5" />
				<span class="hidden md:flex md:visible ml-2">Cart</span>
			</button>
		</div>

		<div class="textcontainer flex flex-col lg:-ml-20 md:-ml-20 text-center">
			<div
				class="header font-bold text-3xl text-white w-full h-12 flex items-center justify-center"
			>
				<h1>Checkout</h1>
			</div>

			<div class="subheader text-lg text-white w-full h-12 flex items-center justify-center">
				<h1>Your summary</h1>
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

	<div
		class="maincontainer flex flex-wrap w-[100%] mt-[50px] justify-items-center lg:pl-[60px] md:pl-[60px] md:justify-between lg:justify-between sm:justify-center pb-8 dark:text-white gap-8"
	>
		<div class="leftside flex flex-col items-center md:items-start gap-5 flex-1 min-w-[320px]">
			<div class="name text-xl font-semibold">
				Vendor: {vendorData.businessname}
			</div>
			<div class="deliveryAddress flex lg:flex-col md:flex-col flex-wrap">
				<div class="flex text-semibold">Delivery Address:</div>
				<div class="area w-[300px]">
					<Input type="text" placeholder="Address" size="md" bind:value={deliveryaddress}>
						<PenSolid slot="right" class="w-5 h-5" />
					</Input>
				</div>
			</div>
			<hr class="w-[100%]" style="border-top: 2px solid rgba(0, 0, 0, 1);" />
			<div class="titles font-semibold w-[100%]">
				<div class="titlegrid grid grid-cols-3 place-items-center">
					<div class="itemname">Item Name</div>
					<div class="remark ml-2">Remark</div>
					<div class="price">Price</div>
				</div>
			</div>
			<hr class="w-[100%]" style="border-top: 2px solid rgba(0, 0, 0, 1);" />
			{#if orderItems.length == 0}
				<div
					class="text text-2xl text-center w-[100%] h-[100%] flex flex-col justify-center font-bold"
				>
					No Items. Please add items to your cart.
				</div>
			{:else}
				{#each orderItems as item}
					<div class="itemcontainer flex flex-col w-[100%]">
						<div class=" grid grid-cols-3 place-items-center">
							<div class="itemname">{item.itemname}</div>
							<div class="ml-2 remark text-justify">
								{#if item.remark}
									{item.remark}
								{:else}
									-
								{/if}
							</div>
							<div class="third flex flex-row items-center">
								<div class="price">RM {item.itemprice}</div>
							</div>
						</div>
					</div>
					<hr class="w-[100%]" style="border-top: 2px solid rgba(0, 0, 0, 0.2);" />
				{/each}
			{/if}
			<hr class="w-[100%]" style="border-top: 2px solid rgba(0, 0, 0, 0.2);" />
		</div>
		<div
			class="rightside flex flex-col md:items-start lg:items-start items-center sm:pl-auto sm:pr-auto w-[100vh] md:w-auto lg:w-auto flex-2"
		>
			<div
				class="rectanglecontainer dark:bg-gray-700 shadow-lg bg-gray-300 text-black dark:text-white w-[90%] self-center items-center rounded p-5"
			>
				<div class="filler w-[100%] flex flex-col items-center font-bold text-xl gap-4">
					<div class="cardtitle text-center">Please fill in your card details</div>
					<div class="carddetails flex flex-col gap-2">
						<div>
							<Label for="first_name" class="mb-1">Name on Card</Label>
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
							<Label for="card_no" class="mb-1">Card Number</Label>
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
							<Label for="exp" class="mb-1">Card Expiry Date</Label>
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
							<Label for="cvv" class="mb-1">CVV</Label>
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
					<div class="bottom flex flex-col items-start dark:text-white">
						<div class="totalprice text-[16px]">Subtotal: RM {Number(pricetotal).toFixed(2)}</div>
						<div class="text-[16px]">Delivery fee: RM {Number(riderComm).toFixed(2)}</div>
						<div class="tax text-[16px]">Sales Tax (8%): RM {Number(salestax).toFixed(2)}</div>
						<div class="text-xl font-bold mt-4">Total: RM {Number(ordertotalprice).toFixed(2)}</div>
					</div>
					{#if orderItems.length == 0}
						<Button class="w-[100%] rounded-full text-[18px] pt-2" disabled>Pay With Card</Button>
						<hr class="w-[100%]" />
						<Button class="w-[100%] rounded-full text-[18px] pt-2" disabled>Pay With Cash</Button>
					{:else}
						<Button class="w-[100%] rounded-full text-[18px] pt-2" on:click={uploadCardData}
							>Pay With Card</Button
						>
						<hr class="w-[100%]" />
						<Button class="w-[100%] rounded-full text-[18px] pt-2" on:click={uploadCashData}
							>Pay With Cash</Button
						>
					{/if}
				</div>
			</div>
		</div>
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
