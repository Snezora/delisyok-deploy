<script>
	import {
		Sidebar,
		SidebarWrapper,
		SidebarItem,
		SidebarGroup,
		DarkMode,
		NavBrand,
		Modal,
		Button,
		List,
		Li,
		Heading,
		Label,
		Input
	} from 'flowbite-svelte';
	import {
		UserGroupSolid,
		MobilePhoneSolid,
		UserSettingsSolid,
		StarOutline,
		QuestionCircleSolid,
		BookSolid
	} from 'flowbite-svelte-icons';
	import './Sidebar.css';
	import { ArrowRightFromBracketSolid } from 'svelte-awesome-icons';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	let spanClass = 'flex-1 ms-0 whitespace-nowrap ';
	let aboutUs = false;
	let contactUs = false;
	let upgrade = false;
	let faq = false;
	let settings = false;
	/**
	 * @type {any}
	 */
	let customername;
	/**
	 * @type {any}
	 */
	let customerhp;

	/**
	 * @type {any}
	 */
	let customeraddressl1;
	/**
	 * @type {any}
	 */
	let customeraddressl2;
	/**
	 * @type {any}
	 */
	let customeraddresscity;
	/**
	 * @type {any}
	 */
	let customeraddressposcode;
	/**
	 * @type {any}
	 */
	let customeraddressstate;
	/**
	 * @type {string | undefined}
	 */
	let user_id;
	/**
	 * @type {any}
	 */
	let customerData;

	onMount(async () => {
		console.log('Start Test: Render Sidebar');

		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		console.log('Fetch Test: User ID ' + user_id);

		console.log('Fetch Test: Customer Data');
		customerData = await fetchCustomerData();
		console.log(customerData);

		console.log('Initialisation Test: Populating Variables');
		customername = customerData.customername;
		customerhp = customerData.customerhp;
		customeraddressl1 = customerData.customeraddressl1;
		customeraddressl2 = customerData.customeraddressl2;
		customeraddresscity = customerData.customeraddresscity;
		customeraddressposcode = customerData.customeraddressposcode;
		customeraddressstate = customerData.customeraddressstate;
		console.log('Render Test: Completed');
	});

	//Fetch All: Future-Proofing
	async function fetchCustomerData() {
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

	//Validation
	function validateaddress() {
		if (!customeraddressl1 || !customeraddressl1 || !customeraddresscity || !customeraddressstate) {
			alert('Please enter an address for delivery purposes.');
			return false;
		}
		return true;
	}

	function validatePoscode() {
		const isValidPoscode = /^\d{5}$/.test(customeraddressposcode);
		if (!isValidPoscode) {
			alert('Please enter a valid poscode.');
		}
		return isValidPoscode;
	}

	function validatePhoneNumber() {
		const isValidHp = /^\d{9,11}$/.test(customerhp);
		if (!isValidHp) {
			alert('Please enter a valid phone number.');
		}
		return isValidHp;
	}

	async function saveNewInfo() {
		if (validatePhoneNumber() && validateaddress() && validatePoscode()) {
			console.log('Saving Information');
			const { error: customerError } = await supabaseClient
				.from('customer')
				.update([
					{
						customername,
						customerhp,
						customeraddressl1,
						customeraddressl2,
						customeraddresscity,
						customeraddressposcode,
						customeraddressstate
					}
				])
				.eq('user_id', user_id);

			if (customerError) {
				alert('Error updating customer data');
				console.error(customerError);
			} else {
				alert('Customer data updated successfully');
			}
		}
	}
</script>

<Sidebar id="customerSidebar" class="sidebar">
	<SidebarWrapper class="h-[100%]">
		<SidebarGroup class={spanClass}>
			<NavBrand>
				<span
					class="font-plain text-3xl logo ml-[4px] self-center whitespace-nowrap dark:text-white"
					>DeliSyok</span
				>
			</NavBrand>
			<hr
				style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:30px;"
			/>
			<SidebarItem label="About Us" iconClass="icon-container" on:click={() => (aboutUs = true)}>
				<svelte:fragment slot="icon">
					<UserGroupSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Order history" href="/client/dashboard/customer/orderhistory">
				<svelte:fragment slot="icon">
					<BookSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Contact us" on:click={() => (contactUs = true)}>
				<svelte:fragment slot="icon">
					<MobilePhoneSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="FAQ" on:click={() => (faq = true)}>
				<svelte:fragment slot="icon">
					<QuestionCircleSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Plan and Pricing" class="mb-[30px]" on:click={() => (upgrade = true)}>
				<svelte:fragment slot="icon">
					<StarOutline
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<hr
				style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:30px;"
			/>
			<div class="ml-7 dark:text-white">
				<span>Theme Switching</span>
			</div>
			<div>
				<DarkMode
					class="mb-[30px] flex justify-center item-center ml-7 mr-3 w-28 h-10 text-gray-500 group-hover:text-gray-900"
				/>
			</div>
			<hr
				style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:0px;"
			/>
			<SidebarItem label="Edit Profile" class="mt-[63px]" on:click={() => (settings = true)}>
				<svelte:fragment slot="icon">
					<UserSettingsSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Logout" on:click={signOut}>
				<svelte:fragment slot="icon">
					<ArrowRightFromBracketSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>

<Modal
	title="About Us"
	class="text-gray-800 dark:text-gray-100"
	bind:open={aboutUs}
	autoclose
	outsideclose
>
	<p class="text-justify text-lg font-medium">
		We are Delisyok, your local food ordering platform providing food ordering services to our
		valued customers.
	</p>
	<Heading tag="h2" customSize="text-lg font-medium" class="font-medium">Our Goals:</Heading>
	<List tag="ul">
		<Li>promote small home-cooked food businesses</Li>
		<Li>encourage healthy lifestyle</Li>
		<Li>provide affordable meals to customers</Li>
	</List>
	<p class="font-medium text-lg">Why Choose Us?</p>
	<p>"Convenient, Healthy, Fast"</p>
	<p class="text-justify">
		We provide rapid meal preparation and delivery service to our valued customers, ensuring
		convenience whilst ensuring a healthy, well-portioned meal for a healthy diet.
	</p>
</Modal>

<Modal
	title="ContactUs"
	class="text-gray-800 dark:text-gray-100"
	bind:open={contactUs}
	autoclose
	outsideclose
>
	<p class="font-medium text-lg">Our Headquarters</p>
	<p>118,Persiaran APEC, Cyberjaya, 63000, Cyberjaya, Selangor</p>
	<hr style="border-top: 2px solid rgba(0, 0, 0, 0.1); margin: 10px 0; margin-bottom:30px;" />
	<p class="font-medium text-lg">Our Contact Number</p>
	<p>+603-82794453</p>
	<hr style="border-top: 2px solid rgba(0, 0, 0, 0.1); margin: 10px 0; margin-bottom:30px;" />
	<p class="font-medium text-lg">Our Email</p>
	<p>Customer Service: services@delisyok.com</p>
	<p>Headquarters: hq@delisyok.com</p>
	<p>Human Resource: hr@delisyok.com</p>
	<p>Marketing: marketing@delisyok.com</p>
</Modal>

<Modal class="text-gray-800 dark:text-gray-100" bind:open={upgrade} autoclose outsideclose>
	<p class="text-lg font-semibold">
		We are cooking something up! Stay tune for plan and pricing updates.
	</p>
</Modal>

<Modal title="FAQ" class="text-gray-800 dark:text-gray-100" bind:open={faq} autoclose outsideclose>
	<p class="font-medium text-lg">
		1. What if my order gets rejected by vendor? Will I get a refund?
	</p>
	<p class="text-justify">
		Yes, you will get a refund upon request. Please do provide us with your email, contact number,
		and order number. You can reach out to us via email or contact number for the refund. We
		understand that waiting for a refund can be frustrating. We truly appreciate your patience and
		understanding during this time.
	</p>
	<p class="font-medium text-lg">2. What if I do not receive my order? What should I do?</p>
	<p class="text-justify">
		You can reach out to us via email or contact number. Please do provide us with your email,
		contact number, and order number. We will conduct an investigation for the cause of the failed
		delivery. Refund is dependent on the outcome of the investigation.
	</p>
	<p class="font-medium text-lg">3. I would like to report a vendor / a rider. How do I do that?</p>
	<p class="text-justify">
		You can reach out to us via email or contact number. We shall entertain your request and
		investigate further regarding the allegations.
	</p>
</Modal>

<Modal bind:open={settings} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Profile</h3>
		<Label class="space-y-2">
			<span>Edit Name</span>
			<Input
				id="customername"
				type="text"
				placeholder={customerData.customername}
				bind:value={customername}
			/>
		</Label>
		<Label class="space-y-2">
			<span>Edit Phone Number</span>
			<Input
				id="customerhp"
				type="text"
				placeholder={customerData.customerhp}
				bind:value={customerhp}
				on:blur={validatePhoneNumber}
			/>
			<span class="text-xs font-medium text-gray-500 dark:text-gray-300"> Do not include +6 </span>
		</Label>
		<hr style="border-top: 1px solid rgba(0, 0, 0, 0.1); margin: 10px 0; margin-bottom:0px;" />
		<Label class="space-y-1">
			<span>Edit Address</span>
			<Input
				id="customeraddressl1"
				type="text"
				placeholder={customerData.customeraddressl1}
				bind:value={customeraddressl1}
			/>
		</Label>
		<Label class="space-y-1">
			<Input
				id="customeraddressl2"
				type="text"
				placeholder={customerData.customeraddressl2}
				bind:value={customeraddressl2}
			/>
		</Label>
		<Label class="space-y-1">
			<Input
				id="customeraddresscity"
				type="text"
				placeholder={customerData.customeraddresscity}
				bind:value={customeraddresscity}
			/>
		</Label>
		<Label class="space-y-1">
			<Input
				id="customeraddressposcode"
				type="text"
				placeholder={customerData.customeraddressposcode}
				bind:value={customeraddressposcode}
				on:blur={validatePoscode}
			/>
		</Label>
		<Label class="space-y-1">
			<Input
				id="customeraddressstate"
				type="text"
				placeholder={customerData.customeraddressstate}
				bind:value={customeraddressstate}
			/>
		</Label>
		<Button on:click={saveNewInfo} href="/client/dashboard/customer">Save Information</Button>
	</form>
</Modal>

<style>
	.logo {
		font-family: 'Monoton', sans-serif;
		color: #f38c10;
		padding: 0px;
		margin-top: 20px;
		margin-bottom: 14px;
	}
</style>
