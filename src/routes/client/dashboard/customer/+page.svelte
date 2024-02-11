<script>
	import { fade, slide } from 'svelte/transition';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import SidebarCustomer from './SidebarCustomer.svelte';
	import { Card, Search, DarkMode } from 'flowbite-svelte';
	import {
		BarsOutline,
		XCompanySolid,
		QuestionCircleOutline,
	} from 'flowbite-svelte-icons';

	let sidebarOpen = false;

	let customerName = '';
	let customerID = '';

	/**
	 * @type {string | undefined}
	 */
	let user_id;
	/**
	 * @type {any}
	 */
	let vendors = []; //List Vendor Array
	let searchInput = '';

	/**
	 * @type {any[]}
	 */
	 let filteredVendors = [];
	 let showHelp = false;

	onMount(async () => {
		console.log('Start Test: Render Client Page');

		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		console.log('Fetch Test: User ID ' + user_id);

		console.log('Fetch Test: Customer Name String');
		customerName = await fetchCustomerName();
		console.log(customerName);

		console.log('Fetch Test: Customer ID String');
		customerID = await fetchCustomerID();
		console.log(customerID);

		console.log('Fetch Test: List Vendor Array');
		vendors = await fetchVendor();
		console.log(vendors);

		clearCart(); //Cart tied to vendor, so must clear cart.

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


	async function fetchCustomerName() {
		const { data, error } = await supabaseClient
			.from('customer')
			.select('customername')
			.eq('user_id', user_id);
		if (error) {
			console.error('Error fetching customer name: ', error);
			return null;
		} else if (data && data.length > 0) {
			return data[0].customername;
		}
		return null;
	}

	async function fetchVendor() {
		const { data: vendor, error } = await supabaseClient.from('vendor').select('vendorid, businessname, storephoto');

		if (error) {
			console.error('Error fetching business name: ', error);
		} else if (vendor && vendor.length > 0) {
			return vendor;
		}
		return vendor;
	}

	//Sidebar function
	async function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}
	$: buttonText = sidebarOpen ? 'Close' : 'Menu';

	//Search Bar
	/**
	 * @param {any} event
	 */
	async function handleSearchInput(event) {
		searchInput = event.target.value;
	}

	//Search for vendor
	async function scrollToVendor() {
		const vendorElement = document.querySelector(`.vendor-${searchInput}`);
		if (vendorElement) {
			vendorElement.scrollIntoView({ behavior: 'smooth' });
		}
	}

	$: filteredVendors = vendors.filter((/** @type {{ businessname: string; }} */ vendor) =>
		vendor.businessname.toLowerCase().includes(searchInput.toLowerCase())
	);

	async function clearCart() {
		const { data, error } = await supabaseClient
			.from('cusorder')
			.select('*')
			.eq('customerid', customerID)
			.eq('cartstatus', 'unpaid'); //unpaid status means cart

		if (error) {
			console.error('Error deleting cart: ', error);
		} else {
			const orderid = data[0]?.orderid;
			if (orderid != null) {
				const { error } = await supabaseClient.from('orderitem').delete().eq('orderid', orderid);

				if (error) {
					console.error('Error deleting cart: ', error);
				} else {
					const { error } = await supabaseClient.from('cusorder').delete().eq('orderid', orderid);

					if (error) {
						console.error('Error deleting cart: ', error);
					}
				}
			}
		}
	}

	/**
	 * @param {any} vendorid
	 */
	//This is added to direct to vendor menu based on the vendorID
	function directToVendorMenu(vendorid) {
		window.location.href = `/client/dashboard/customer/${vendorid}`;
	}

	function toggleHelp() {
		showHelp = !showHelp;
	}
</script>

<div
	class="{showHelp
		? 'block'
		: 'hidden'} z-20 fixed inset-0 bg-semi-transparent flex items-center justify-center"
>
	<div class="p-4 dark:bg-slate-800 dark:text-white bg-white rounded shadow-lg">
		<h2 class="text-2xl font-bold mb-2">Help</h2>
		<div class="mt-[20px] text-lg">
			<p>Welcome to the Customer Client Page.</p>
			<p>
				Here you can find the list of vendors. Click on the desired vendor cards to view their menu.
			</p>
			<p></p>
		</div>
		<div class="mt-[30px]">
			<p class="font-bold">Need help to find your order history, switch themes, and more?</p>
			<p class="flex items-center">
				It is in the menu sidebar. You can access it with the menu button with icon <BarsOutline
					class="w-4 h-4 ml-1 mr-1"
				/>.
			</p>
		</div>

		<div class="mt-[20px]">
			<p class="font-bold">Know a vendor?</p>
			<p>You can use our search bar to search for the vendor name!</p>
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

<div class="fixed z-20">
	{#if sidebarOpen}
		<div class="fixed h-[100%]">
			<SidebarCustomer />
		</div>
	{/if}
</div>

<div class="page-container min-h-[100vh] overflow-x-hidden dark:bg-stone-600">
	<div class="flex flex-row justify-between h-30 w-[100%] bg-gray-900">
		<div class="justify-start items-center ml-24 h-[100%] mt-auto mb-auto"></div>

		<div class="textcontainer flex flex-col mr-10 text-center">
			<div class="font-bold lg:text-3xl md:text-3xl text-2xl text-white w-full h-12 flex items-center justify-center">
				<h1>Hello, {customerName}</h1>
			</div>

			<div class="lg:text-lg md:text-lg text-[16px] text-white w-full h-12 flex items-center justify-center">
				<h1>What will your next order be?</h1>
			</div>
		</div>

		<div class="h-[100%] mt-auto mb-auto">
			<button
				class="flex justify-center items-center hover:bg-slate-700 bg-slate-800 rounded-lg px-[14px] py-[6px] text-white mr-4"
				on:click={toggleHelp}
				disabled={sidebarOpen}
			>
				<QuestionCircleOutline class="h-6 w-6" />
			</button>
		</div>
	</div>

	<div class="absolute z-10">
		<button
			class="md:w-[120px] lg:w-[120px] justify-center m-4 ml-4 px-4 py-2 rounded-lg h-[40px] border bg-primary-600 border-solid border-[#EF562F]
			hover:bg-slate-700 hover:border-slate-700 shadow-md font-bold text-white inline-flex items-center {sidebarOpen
				? 'translate-x-[179px] translate-y-[-112px] fixed'
				: ''}"
			on:click={toggleSidebar}
		>
			{#if sidebarOpen == true}
				<XCompanySolid class="h-5 w-5" />
			{:else}
				<BarsOutline class="h-5 w-5" />
			{/if}
			<span class="hidden md:flex md:visible ml-2">{buttonText}</span>
		</button>
	</div>

	<div class="flex flex-col items-center">
		<div
			class="font-bold text-2xl relative -translate-x-2/4 -translate-y-2/4 w-full text-center mt-auto left-2/4 top-20 dark:text-white"
		>
			Vendor
		</div>
		<form class="flex gap-2 mt-20" on:submit|preventDefault={scrollToVendor}>
			<Search
				size="md"
				input
				bind:value={searchInput}
				on:input={handleSearchInput}
				class="form-input"
				type="text"
				placeholder="Search Vendor"
			/>
		</form>

		<div
			class="card-container w-[80%] grid lg:grid-cols-3 md:grid-cols-2 justify-center place-self-center gap-20 my-7"
		>
			{#each filteredVendors as vendor}
				<div
					class="flex relative h-[100%] justify-self-center vendor-${vendor.businessname}"
					in:slide
					out:fade
				>
					<Card
						img={`https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/vendorstore/${vendor.storephoto}`}
						href="#"
						class="rounded-lg  object-cover max-h-[100%] flex flex-col justify-between"
						on:click={() => directToVendorMenu(vendor.vendorid)}
					>
						<div class="card-content bottom-0 w-[100%] p-5 ml-auto mr-auto">
							<h5
								class="mb-2 text-2xl min-w-[60px] font-bold tracking-tight text-center text-gray-900 dark:text-white"
							>
								{vendor.businessname}
							</h5>
						</div>
					</Card>
				</div>
			{/each}
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
