<script>
	import { Button, DarkMode, Modal } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import {
		ArrowLeftOutline,
		CartOutline,
		ExclamationCircleOutline,
		QuestionCircleOutline
	} from 'flowbite-svelte-icons';
	import { slide, fade } from 'svelte/transition';

	const vendorid = $page.params.vendorMenu;
	/**
	 * @type {string | undefined}
	 */
	let user_id; //Customer ID

	/**
	 * @type {any}
	 */
	let customerID;

	/**
	 * @type {any}
	 */
	let vendorInfo = '';

	/**
	 * @type {any[] | undefined}
	 */
	let vendorMenu = [];
	let cart = [];
	let popupModal = false;
	/**
	 * @type {any}
	 */
	let printDay;

	onMount(async () => {
		console.log('Start Test: Render Menu Page');

		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		console.log('Fetch Test: User ID ' + user_id);

		console.log('Fetch Test: Customer ID');
		customerID = await fetchCustomerID();
		console.log(customerID);

		console.log('Fetch Test: Vendor Info');
		vendorInfo = await getVendor();
		console.log(vendorInfo);

		console.log('Conversion Test: Operating days');
		if (vendorInfo) {
			let days = vendorInfo.businessopday;
			printDay = days.replace(/[\[\]"]/g, ' ');
		}
		console.log(printDay);

		console.log('Fetch Test: Vendor Menu Array');
		vendorMenu = await getMenuItem();
		console.log(vendorMenu);

		console.log('Fetch Test: Cart');
		cart = await fetchCart();
		console.log(cart);

		console.log('Render Test: Completed');
	});

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

	async function getVendor() {
		const { data, error } = await supabaseClient
			.from('vendor')
			.select(
				'businessname, storephoto, businessstarttime, businessclosingtime, businessopday, vendorkkmlistingno, businessdescription, vendorhp'
			)
			.eq('vendorid', vendorid);

		if (error) {
			console.error('Error fetching vendor:', error);
		} else {
			return data[0];
		}
	}

	//Vendor Menu Array
	async function getMenuItem() {
		const { data, error } = await supabaseClient
			.from('menuitem')
			.select('itemid, itemname, itemimage, itemprice')
			.eq('isActive', true)
			.eq('vendorid', vendorid);

		if (error) {
			console.error('Error fetching menu:', error);
		} else {
			return data;
		}
	}

	/**
	 * @param {any} itemid
	 */
	function goToItemPage(itemid) {
		window.location.href = `/client/dashboard/customer/${vendorid}/${itemid}`;
	}

	/**
	 * @param {any} time
	 */
	function formatTime(time) {
		const formattedTime = new Date(`2000-01-01T${time}`); // Use an arbitrary date for parsing
		return formattedTime.toLocaleString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	async function fetchCart() {
		const { data, error } = await supabaseClient
			.from('cusorder')
			.select('*')
			.eq('customerid', customerID)
			.eq('cartstatus', 'unpaid')
			.order('ordergenerated', { ascending: false });

		if (error) {
			console.error('Error creating new cart: ', error);
		} else {
			if (data[0] == null) {
				//If there's no record of a cart, create a cart
				const { error } = await supabaseClient.from('cusorder').insert({
					customerid: customerID,
					ordergenerated: new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' }),
					cartstatus: 'unpaid'
				});

				if (error) {
					console.error('Error creating new cart: ', error);
				} else {
					const { data, error } = await supabaseClient
						.from('cusorder')
						.select('*')
						.eq('customerid', customerID)
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

	//To access the menuItem pages, do this href="/client/dashboard/customer/{vendorid}/{itemid}"
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
			<p class="font-bold">Want to see the description of a menu item or purchase an item?</p>
			<p>Just click on the Add to cart button.</p>
		</div>
		<div class="mt-[20px]">
			<p class="font-bold">Want to view your cart?</p>
			<p class="flex items-center">
				Just click on the cart button with <CartOutline class="w-4 h-4 ml-1 mr-1" /> icon.
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

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-600">
	<div class="flex flex-row justify-between w-[100%] bg-gray-900">
		<div class="justify-start items-center ml-4 h-[100%] mt-auto mb-auto">
			<button
				class="justify-center px-4 py-2 hover:bg-slate-700 bg-slate-800 text-white rounded-lg inline-flex items-center"
				on:click={() => (popupModal = true)}
			>
				<ArrowLeftOutline class="h-5 w-5" />
				<span class="hidden md:flex md:visible ml-2">Vendor List</span>
			</button>
		</div>

		<div class="textcontainer flex flex-col lg:-ml-18 md:-ml-24">
			<div class="mt-2 font-bold text-3xl text-white w-full h-16 flex items-center justify-center">
				<h1>{vendorInfo.businessname}</h1>
			</div>

			<div class="flex justify-center items-center h-[100%]">
				<Button
					class="w-[100px] lg:w-[200px] md:w-[200px] mt-1 h-[30px] flex  bg-primary-600 rounded-lg text-white"
					on:click={() => (window.location.href = `/client/dashboard/customer/${vendorid}/cart/`)}
				>
					<CartOutline class="w-5 h-5 text-white" />
					<span class="hidden md:flex md:visible ml-2">Cart</span>
				</Button>
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
		class="dark:bg-gray-800 dark:text-white bg-gray-100 p-3 lg:grid md:grid sm:grid flex flex-col justify-center lg:items-stretch md:items-stretch sm:items-stretch item items-center grid-cols-[1fr,7fr] gap-3"
	>
		<div class="h-[200px] w-[300px] relative">
			<img
				src="https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/vendorstore/{vendorInfo.storephoto}"
				alt=""
				height="200"
				width="300"
				class="absolute inset-0 w-full h-full object-cover object-center align-middle bg-white"
			/>
		</div>
		<div class="ml-3 overflow-hidden flex flex-col justify-between" style="word-wrap: break-word;">
			<div>
				<h1 class="font-medium">Business Description:</h1>
				<h1 class="text-sm">
					{vendorInfo.businessdescription ? vendorInfo.businessdescription : '-No Description-'}
				</h1>
			</div>

			<div class="mt-2 font-medium">
				<div class="mt-1">
					KKM Listing No: {vendorInfo.vendorkkmlistingno}
				</div>
				<div class="hours mt-2">
					Operating Hours: {formatTime(vendorInfo.businessstarttime)} - {formatTime(
						vendorInfo.businessclosingtime
					)}
				</div>
				<div class="mt-2">
					Operating Days: {printDay}
				</div>
			</div>
		</div>
	</div>

	<div
		class="menucontainer grid md:grid-cols-2 lg:grid-cols-2 grid-rows-1 place-items-center p-5 gap-5"
	>
		{#if vendorMenu}
			{#each vendorMenu as menuItem}
				<div
					class="h-[122px] w-[100%] border-black border dark:bg-gray-800 dark:border-gray-900 dark:text-white shadow-md rounded-lg"
					in:slide
					out:fade
				>
					<div class="flex flex-row h-[120px] w-[100%]">
						<img
							src="https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/menuitemimage/{menuItem.itemimage}"
							alt=""
							height="100"
							width="120"
							class="align-middle bg-white rounded-l-lg"
						/>
						<div class="iteminfo w-[100%] flex flex-col justify-between items-center">
							<h1 class="text-xl font-bold text-center">{menuItem.itemname}</h1>

							<div class="p-1">
								<h1 class="text-xl font-semibold text-center">
									RM {Number(menuItem.itemprice).toFixed(2)}
								</h1>
								<Button
									class="justify-center lg:w-[160px] lg:text-[16px] md:w-[160px] md:text-[16px] sm:w-[160px] sm:text-[16px] w-100px text-[12px] rounded-full"
									on:click={() => goToItemPage(menuItem.itemid)}
									href="#"
								>
									Add to cart
								</Button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-red-500" />
		<h3 class="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to go back?
		</h3>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			This will delete your cart
		</h3>
		<Button
			color="red"
			class="me-2"
			on:click={() => (window.location.href = '/client/dashboard/customer/')}>Yes, I'm sure</Button
		>
		<Button color="alternative" on:click={() => (popupModal = false)}>No, cancel</Button>
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
