<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { Button, Modal, DarkMode, Label, Textarea } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import {
		ExclamationCircleOutline,
		ArrowLeftOutline,
		QuestionCircleOutline
	} from 'flowbite-svelte-icons';
	let popupModal = false;

	const itemid = $page.params.menuItem;
	/**
	 * @type {any}
	 */
	let vendorData;
	/**
	 * @type {any}
	 */
	let customerData;
	/**
	 * @type {string | undefined}
	 */
	let user_id;
	/**
	 * @type {any}
	 */
	let menuItemData = '';
	/**
	 * @type {any}
	 */
	let vendorid;
	/**
	 * @type {any}
	 */
	let vendorName;
	/**
	 * @type {any}
	 */
	let customerid;
	/**
	 * @type {any}
	 */
	let remark;
	/**
	 * @type {{ orderid: any; }}
	 */
	let cart;

	onMount(async () => {
		console.log('Start Test: Render Menu Item Page');

		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		console.log('Fetch Test: User ID ' + user_id);

		console.log('Fetch Test: Menu Item Data');
		menuItemData = await fetchMenuItemData();
		console.log(menuItemData);

		console.log('Fetch Test: Vendor Data');
		vendorData = await fetchVendorData();
		console.log(vendorData);

		console.log('Initialisation Test: Populating Variables');
		vendorid = vendorData.vendorid;
		vendorName = vendorData.businessname;
		console.log(vendorid);
		console.log(vendorName);

		console.log('Fetch Test: Customer ID');
		customerid = await fetchCustomerID();
		console.log(customerid);

		console.log('Fetch Test: Cart');
		cart = await fetchCart();
		console.log(cart);

		console.log('Render Test: Completed');
	});

	async function fetchMenuItemData() {
		const { data, error } = await supabaseClient.from('menuitem').select('*').eq('itemid', itemid);

		if (error) {
			console.error('Error fetching menu item: ', error);
		} else {
			return data[0];
		}
	}

	async function fetchVendorData() {
		const { data, error } = await supabaseClient
			.from('vendor')
			.select('vendorid, businessname')
			.eq('vendorid', menuItemData.vendorid);

		if (error) {
			console.error('Error fetching vendor data: ', error);
		} else {
			return data[0];
		}
	}

	async function fetchCustomerID() {
		const { data, error } = await supabaseClient
			.from('customer')
			.select('customerid')
			.eq('user_id', user_id);
		if (error) {
			console.error('Error fetching customer ID: ', error);
			return null;
		} else if (data && data.length > 0) {
			return data[0].customerid;
		}
		return null;
	}

	async function fetchCart() {
		const { data, error } = await supabaseClient
			.from('cusorder')
			.select('*')
			.eq('customerid', customerid)
			.eq('cartstatus', 'unpaid')
			.order('ordergenerated', { ascending: false });

		if (error) {
			console.error('Error creating new cart: ', error);
		} else {
			//Not suposed to be triggered but in case customer open old link.
			if (data[0] == null) {
				//If there's no record of a cart, create a cart
				const { error } = await supabaseClient.from('cusorder').insert({
					customerid: customerid,
					ordergenerated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
					cartstatus: 'unpaid'
				});

				if (error) {
					console.error('Error creating new cart: ', error);
				} else {
					const { data, error } = await supabaseClient
						.from('cusorder')
						.select('*')
						.eq('customerid', customerid)
						.eq('cartstatus', 'unpaid')
						.order('ordergenerated', { ascending: false });

					if (error) {
						console.error('Error creating new cart: ', error);
					} else {
						return data[0];
					}
				}
			} else {
				return data[0];
			}
		}
	}

	async function addItemIntoCart() {
		const { error } = await supabaseClient.from('orderitem').insert({
			remark,
			orderid: cart.orderid,
			itemid,
			itemprice: menuItemData.itemprice,
			itemname: menuItemData.itemname
		});

		if (error) {
			console.error('Error adding item into cart: ', error);
		} else {
			popupModal = true;
			setTimeout(() => {
				backMenu();
			}, 2000);
		}
	}

	async function backMenu() {
		window.location.href = `/client/dashboard/customer/${vendorid}`;
	}

	//export let data;
	let showHelp = false;

	function toggleHelp() {
		showHelp = !showHelp;
	}
</script>

<div
	class="{showHelp
		? 'block'
		: 'hidden'} z-20 fixed inset-0 bg-semi-transparent flex items-center justify-center"
>
	<div class="p-4 bg-white rounded shadow-lg">
		<h2 class="text-2xl font-bold mb-2">Help</h2>

		<div class="mt-[20px]">
			<p class="font-bold">Want to let the chef know your specific request for this food item?</p>
			<p class="text-justify">
				There is a remark box provided to write regarding your preferences, allergies, and more. We
				and our collaborating vendors value our customer opinions. Our vendor will do their best to
				make your meal best suit your palate.
			</p>
		</div>
		<div class="mt-[20px]">
			<p class="font-bold">Done with your customisation?</p>
			<p>Click on the confirm button to add your order to the cart.</p>
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

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-600">
	<div class="flex flex-row justify-between w-[100%] bg-gray-900">
		<div class="justify-start items-center ml-4 h-[100%] mt-auto mb-auto">
			<button
				class="justify-center px-4 py-2 hover:bg-slate-700 bg-slate-800 text-white rounded-lg inline-flex items-center"
				on:click={backMenu}
			>
				<ArrowLeftOutline class="h-5 w-5" />
				<span class="hidden md:flex md:visible ml-2">Menu</span>
			</button>
		</div>

		<div class="textcontainer flex flex-col lg:-ml-18 md:-ml-24 text-center">
			<div class="mt-2 font-bold text-3xl text-white w-full h-16 flex items-center justify-center">
				<h1>{vendorName}</h1>
			</div>

			<div class="flex justify-center items-center h-[100%] text-white font-semibold text-lg">
				Customise your food
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
		class="maincontainer grid md:grid-cols-2 lg:grid-cols-2 place-items-center w-[100%] mt-10 md:justify-between lg:justify-between sm:justify-center dark:text-white gap-10 p-6"
	>
		<div class="leftside flex flex-col gap-1 items-center">
			<img
				src="https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/menuitemimage/{menuItemData.itemimage}"
				alt=""
				height="100"
				width="250"
				class="align-middle rounded-xl shadow-md justify-center"
			/>
			<h1 class="text-3xl font-bold text-center">{menuItemData.itemname}</h1>
			<div class="description text-center w-[300px]" style="word-wrap: break-word;">
				{menuItemData.itemdescription}
			</div>
		</div>
		<div class="rightside w-[100%] flex flex-col items-center">
			<div
				class="cardcontainer dark:text-white dark:bg-gray-700 bg-gray-300 w-[80%] p-5 rounded-xl flex flex-col gap-5"
			>
				<div class="text">
					<Label for="textarea-id" class="mb-2">Write your remark for the food here!</Label>
					<Textarea
						class="dark:bg-gray-100"
						id="textarea-id"
						placeholder="Remark"
						rows="8"
						name="message"
						bind:value={remark}
						maxlength="255"
					/>
					{#if remark && remark.length}
						<p>{remark.length} / 255</p>
					{/if}
				</div>
				<div class="price text-center text-xl font-bold">
					Price: RM {Number(menuItemData.itemprice).toFixed(2)}
				</div>
				<div class="flex flex-col justify-center items-center">
					<Button class="rounded-full w-[200px]" on:click={addItemIntoCart}>Confirm</Button>
				</div>
			</div>
		</div>
	</div>
</div>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Item Added! You will be redirected back to the Vendor's Menu.</h3>
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
