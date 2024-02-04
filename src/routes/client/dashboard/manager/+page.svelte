<script>
	import { goto } from '$app/navigation';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';

	let user_id;
	/**
	 * @type {never[]}
	 */
	let userinfo = [];

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
			userinfo = data[0];
		}

    console.log(userinfo);
	});

	function goToVendorReport() {
		goto('/client/dashboard/manager/vendorreport/vendorlist');
	}
	function goToDeliveryReport() {
		goto('/client/dashboard/manager/deliveryreport/riderlist');
	}
	function goToRefund() {
		goto('/client/dashboard/manager/refund');
	}
	function goToCustomerReport() {
		goto('/client/dashboard/manager/customerreport/customerlist');
	}

	async function signOut() {
		const { error } = await supabaseClient.auth.signOut();
		if (error) {
			alert(error.message);
		} else {
			if (typeof window !== 'undefined') {
				window.location.href = '/auth/login';
			}
		}
	}
</script>

<div
	class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500 flex flex-row"
>
	<div class="header h-30 bg-gray-900 w-[100%]">
		<div class="dashboard flex flex-col h-[100%]">
			<div class="text-white mt-6">
				<h1>Welcome back, System Manager</h1>
				<!--add system manager name-->
			</div>

			<div class="text-white mb-8">
				<h1>What would you like to do today?</h1>
			</div>
		</div>
	</div>

	<div class="buttons mt-12 w-[100%] p-[120px] gap-6 h-[100%] flex flex-col">
		<button on:click={goToVendorReport}>View Vendor Sales Report</button>
		<button on:click={goToDeliveryReport}>View Delivery Report</button>
		<button on:click={goToRefund}>Refund Undelivered/Rejected Order</button>
		<button on:click={goToCustomerReport}>View Customer Order History</button>
		<button on:click={signOut}>Sign Out</button>
	</div>
</div>

<style>
	.dashboard {
		font-size: 30px;
		font-family: 'Molengo', sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	button {
		padding: 20px 40px;
    width: 100%;
		font-size: 20px;
		font-family: 'Inria Sans', sans-serif;
		background-color: #ef562f;
		border-radius: 10px;
		border: none;
		color: white;
		cursor: pointer;
	}
</style>
