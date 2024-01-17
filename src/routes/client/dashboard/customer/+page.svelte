<script>
	import { crossfade, draw, fade, fly, slide } from 'svelte/transition';
	/** @type {import('./$types').PageData} */
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import SidebarCustomer from './SidebarCustomer.svelte';
	import { Card, Toggle, Search, Button } from 'flowbite-svelte';
	import { SearchOutline } from 'flowbite-svelte-icons';

	let sidebarOpen = false;

	let userData;
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
	let vendors = [];

	onMount(async () => {
		console.log('im here start');
		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		customerData = await fetchCustomerData();
		vendors = await fetchVendor();
		console.log(customerData);
		console.log(vendors);
	});

	async function fetchCustomerData() {
		console.log('im here');

		const { data, error } = await supabaseClient
			.from('customer')
			.select('*')
			.eq('user_id', user_id);

		if (error) {
			console.error('Error fetching customer name: ', error);
		} else if (data && data.length > 0) {
			return data[0];
		}
		return customerData;
	}

	async function fetchVendor() {
		const { data: vendor, error } = await supabaseClient.from('vendor').select('*');

		if (error) {
			console.error('Error fetching business name: ', error);
		} else if (vendor && vendor.length > 0) {
			return vendor;
		}
		return vendor;
	}

	/**
	 * @param {string | undefined} [storephoto]
	 */
	async function getStorePhoto(storephoto) {
		const { data } = supabaseClient.storage.from('vendorstore').getPublicUrl(`${storephoto}`);
		console.log(data);
		if (data) {
			return data.publicUrl;
		} else {
			return '';
		}
	}

	async function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	let searchInput = '';

	/**
	 * @param {any} event
	 */
	async function handleSearchInput(event){
		searchInput = event.target.value;
	}

	async function scrollToVendor(){
		const vendorElement = document.querySelector(`.vendor-${searchInput}`);
		if(vendorElement){
			vendorElement.scrollIntoView({ behavior: 'smooth'});
		} else{
			alert('No vendor found with that name')
		}
	}

	let filteredVendors = [];

	$: filteredVendors = vendors.filter((vendor) =>
    	vendor.businessname.toLowerCase().includes(searchInput.toLowerCase())
	);
	
</script>

<div class="fixed z-10">
	{#if sidebarOpen}
		<div class="fixed">
			<SidebarCustomer />
		</div>
	{/if}
</div>

<div class="page-container min-h-[100vh]">
	<div class="flex flex-col items-center h-16 bg-gray-900">
		<div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
			<h1>Hi, Shopper.</h1>
		</div>

		<div class="text-base text-white w-full h-8 flex items-center justify-center">
			<h1>What will your next order be?</h1>
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

	<div class="flex flex-col items-center">
		<div
			class="font-bold text-2xl relative -translate-x-2/4 -translate-y-2/4 w-full text-center mt-auto left-2/4 top-20"
		>
			Vendor
		</div>
		<form class="flex gap-2 mt-20" on:submit|preventDefault={scrollToVendor}>
			<Search size="md" input bind:value={searchInput} on:input={handleSearchInput} class="form-input" type="text" placeholder="Search Vendor"/>
			<!-- <Button class="!p-2.5">
				<SearchOutline class="w-5 h-5" />
			</Button> -->
		</form>

		<div
			class="card-container w-[90%] grid lg:grid-cols-3 md:grid-cols-2 justify-center place-self-center gap-20 my-7"
		>
			{#each filteredVendors as vendor}
				<div class="flex relative vendor-${vendor.businessname}" in:slide out:fade>
						<Card
							img={`https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/vendorstore/${vendor.storephoto}`}
							href="/"
							size="md"
							class="rounded-lg w-96 h-96 object-cover"
						>
						<div class="card-content absolute bottom-0 w-full p-5 translate-x-[-25px]">
							<h5 class="mb-2 text-2xl min-w-[60px] font-bold tracking-tight text-center text-gray-900 dark:text-white">
								{vendor.businessname}
							</h5>
						</div>
						</Card>
					</div>
			{/each}
		</div>

		<div class="flex mt-20">
			<div class="w-28 h-28 bg-blue-500 m-4"></div>
			<div class="w-28 h-28 bg-red-500 m-4"></div>
			<div class="w-28 h-28 bg-green-500 m-4"></div>
			<div class="w-28 h-28 bg-yellow-500 m-4"></div>
		</div>
	</div>
</div>
