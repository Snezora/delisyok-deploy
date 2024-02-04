<script>
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import {
		Drawer,
		CloseButton,
		Accordion,
		AccordionItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button
	} from 'flowbite-svelte';
	import { hidden2 } from '../../../../../stores/sidebar';
	import Sidebar from '../../../../../Sidebar.svelte';
	import { sineIn } from 'svelte/easing';
	import SpinnerSet from '../../../../SpinnerSet.svelte';

	import { goto } from '$app/navigation';
	let searchQuery = '';

	/**
	 * @type {any[]}
	 */
	let customers = [];

	onMount(async () => {
		const { data, error } = await supabaseClient.from('customer').select('*');

		if (error) {
			console.error('Error fetching customers:', error);
		} else {
			customers = data;
		}

		console.log(customers);
	});

	/**
	 * @param {string} customerid
	 */
	function goTo(customerid) {
		goto('/client/dashboard/manager/customerreport/' + customerid);
	}

	/**
	 * @type {any[]}
	 */
	let filteredCustomers = [];

  $: filteredCustomers = customers.filter((customer) =>
  customer.customername.toLowerCase().includes(searchQuery.toLowerCase()) ||
  customer.customerid.toString().includes(searchQuery.toLowerCase())
);

</script>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
	<div class="header h-20 bg-gray-900 px-6 py-4 flex flex-row justify-between">
    <button on:click={()=>{window.location.href="/client/dashboard/manager"}}><ArrowLeftOutline /></button>
  </div>

	<main class="flex flex-col">
		<h1>Welcome to the Customer Order History Page</h1>
		<p>Search for customer:</p>
		<input type="text" bind:value={searchQuery} placeholder="Customer Name / ID" class=" max-w-[45%] self-center" />
		<div class="customerlist flex flex-col self-center max-w-[600px] w-[100%]">
			{#if searchQuery != ''}
				{#each filteredCustomers as customer}
					<div class="cardcontainer flex flex-row w-[100%] pt-2 align-middle mb-5 gap-5 border border-black rounded-xl hover:cursor-pointer hover:bg-gray-200" on:click={goTo(customer.customerid)}>
            <div class="id w-[100%]">
              <p>{customer.customerid}</p>
            </div>
            <div class="name w-[100%]">
              <p>{customer.customername}</p>
            </div>
          </div>
				{/each}
			{/if}
		</div>
	</main>
</div>

<style>
	main {
		text-align: center;
		font-family: 'Inria Sans', sans-serif;
		padding: 20px;
	}

	h1 {
		font-size: 24px;
		font-family: 'Inria Sans', sans-serif;
		margin-bottom: 10px;
	}

	p {
		font-size: 20px;
		font-family: 'Inria Sans', sans-serif;
		margin-bottom: 5px;
	}

	input {
		padding: 5px;
		font-family: 'Inria Sans', sans-serif;
		margin-bottom: 30px;
	}

	button {
		padding: 5px 10px;
		background-color: #ef562f;
		color: #fff;
		border: none;
		border-radius: 10px;
		cursor: pointer;
	}
</style>
