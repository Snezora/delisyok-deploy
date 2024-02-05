<script>
	import { Button, Modal } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { ArrowLeftOutline, ExclamationCircleOutline} from 'flowbite-svelte-icons';
	import { fly } from 'svelte/transition';

	/**
	 * @type {string}
	 */
	let vendorid;

	/**
	 * @type {string}
	 */
	let time;

    let user_id;
	let searchQuery = '';
    let sysmanInfo = [];
    	/**
	 * @type {any[] | undefined}
	 */
    let orders = [];

	onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;

        const { data, error } = await supabaseClient
        .from('systemmanager')
        .select('*')
        .eq('user_id', user_id);

        if (error) {
            console.error('Error fetching info: ', error);
        } else {
            sysmanInfo = data[0];
        }

        orders = await getOrders();

		const channels = supabaseClient
			.channel('custom-update-channel')
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: 'sale' },
				(payload) => {
					window.location.reload();
				}
			)
			.subscribe();
	});

    async function getOrders(){
        const { data, error } = await supabaseClient
        .from('sale')
        .select('*, cusorder(*), vendor(*), deliveryrider(*)')
        .order('receiptgenerated', { ascending: false });

        if (error) {
            console.error('Error fetching orders: ', error);
        } else {
            return data;
        }
    }

	function goTo() {
		goto('/client/dashboard/manager/');
	}

	/**
	 * @param {any} saleid
	 */
	async function approveRefund(saleid) {
		const { data, error } = await supabaseClient
			.from('sale')
			.update({ refund: true })
			.eq('saleid', saleid);

		if (error) {
			console.error('Error updating order status:', error);
		} else {
			alert("Order " + saleid + " has been refunded.");
			location.reload();
		}
	}

    function formatDate(dateString) {
        const options = { 
            hour: '2-digit', 
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleString('en-GB', options);
    }

    function capitalizeFirstLetter(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }

	let popupModal = false;
	/**
	 * @type {any}
	 */
	let selectedsale;

	/**
	 * @param {any} saleid
	 */
	function openModal(saleid){
		popupModal = true;
		selectedsale = saleid;
	}

	/**
	 * @type {any[]}
	 */
	let filteredOrders = [];

	$: filteredOrders = orders.filter(
		(order) =>
			order.saleid.toString().includes(searchQuery.toLowerCase())
	);
</script>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500 w-[100%] flex flex-col">
	<div class="header h-20 bg-gray-900 px-6 py-4 flex flex-row justify-between w-[100%]">
		<button
			on:click={() => {
				window.location.href = '/client/dashboard/manager';
			}}><ArrowLeftOutline /></button
		>
	</div>
	<main class="flex flex-col text-center mt-5 mb-5 gap-3">
		<h1 class="text-3xl font-bold">Welcome to the Refund Portal</h1>
		<p class="text-xl">Search for Sale ID to initiate refund:</p>
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Sale ID"
			class="max-w-[45%] self-center rounded-xl"
		/>
	</main>

    <div class="riderlist flex flex-col self-center max-w-[1000px] w-[100%]">
        {#if searchQuery != ''}
            {#each filteredOrders as order}
            <div class="body mt-8 text-xl bg-grey flex flex-col items-center justify-left w-[100%]" in:fly out:fly>
                <div class="orderBlock w-[100%]">
                    <div class="ml-8 mt-1 p-5 grid md:grid-cols-2 grid-row-1">
                        <div class="firstpart">
                            <h1>Sales ID: {order.saleid}</h1>
                            <h1>Receipt Generated: {formatDate(order.receiptgenerated)}</h1>
                            <h1>Vendor Order Status: {capitalizeFirstLetter(order.vendororderstatus)}</h1>
                        </div>
                        <div class="secondpart">
                            <h1>Delivery Status: {capitalizeFirstLetter(order.deliverystatus)}</h1>
                            <h1>Total Amount: RM {order.totalamount}</h1>
                            <div class="refundsec flex flex-row w-[100%] gap-2">
                                <p>Refund:</p>
								{#if order.refund == false}
                                	<Button on:click={openModal(order.saleid)} class="">Yes</Button>
								{:else}
									<p class="text-red-600 font-bold">Refunded</p>
								{/if}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/each}
        {/if}
    </div>

    <div class = "footer mt-8 text-white text-2xl bg-grey flex w-[100%] mb-6">
        <div class="text-white text-2xl flex flex-1 self-center">
            <div class="returnPosition flex flex-row align-middle justify-center">
                <Button type="button" class="w-[325px] mt-4" on:click={goTo} id="returnbutton">Return</Button>
            </div>
        </div>
    </div>
</div>

<Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-red-500" />
        <h3 class="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to refund this order?</h3>
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"> Selected Sale ID: {selectedsale}</h3>
      <Button color="red" class="me-2" on:click={() => approveRefund(selectedsale)}>Yes, I'm sure</Button>
      <Button color="alternative" on:click={(() => (popupModal = false))}>No, cancel</Button>
    </div>
</Modal>

<style>
	.returnPosition {
		flex: 1;
		border: 2px solid;
		margin: 10px;
	}
	.orderBlock {
		width: 80%;
		height: 20%;
		top: 616px;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background: #d9d9d9;
		border-radius: 20px;
		overflow: auto;
	}
</style>
