<script>
	import {
		Sidebar,
		SidebarWrapper,
		SidebarBrand,
		SidebarItem,
		SidebarGroup,
		DarkMode,
		NavBrand,
		Modal,
		Button,
		Carousel,

		List,

		Li,

		Heading



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
	let spanClass = 'flex-1 ms-0 whitespace-nowrap ';
	let aboutUs = false;
	let contactUs = false;
	let upgrade = false;

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

<Sidebar id="customerSidebar" class="sidebar">
	<SidebarWrapper class="h-[100%]">
		<SidebarGroup class={spanClass}>
			<NavBrand>
				<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
				<span
					class="font-plain text-3xl logo ml-[4px] self-center whitespace-nowrap dark:text-white"
					>DeliSyok</span
				>
			</NavBrand>
			<hr style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:30px;" />
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
			<SidebarItem label="Help">
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
      <hr style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:30px;" />
      <div class="ml-7 dark:text-white">
        <span>Theme Switching</span>
      </div>
      <div >
        <DarkMode class="mb-[30px] flex justify-center item-center ml-7 mr-3 w-28 h-10 text-gray-500 group-hover:text-gray-900" />
      </div>
      <hr style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:30px;" />
      <SidebarItem label="Settings" class="mt-[80px] ">
				<svelte:fragment slot="icon">
					<UserSettingsSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Sign Out" on:click={signOut}>
				<svelte:fragment slot="icon">
					<ArrowRightFromBracketSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>

<Modal title="About Us" class="text-gray-800 dark:text-gray-100" bind:open={aboutUs} autoclose outsideclose>
	<p class="text-justify text-lg font-medium">
		We are Delisyok, your local food ordering platform providing food ordering services to our valued customers.
	</p>
	<Heading tag="h2" customSize="text-lg font-medium" class="font-medium">Our Goals:</Heading>
	<List tag="ul">
		<Li>promote small home-cooked food businesses</Li>
		<Li>encourage healthy lifestyle</Li>
		<Li>provide affordable meals to customers</Li>
	</List>
	<p class="font-medium text-lg">
		Why Choose Us?
	</p>
	<p>
		"Convenient, Healthy, Fast"
	</p>
	<p class="text-justify">
		We provide rapid meal preparation and delivery service to our valued customers, ensuring convenience whilst ensuring a healthy, well-portioned meal for a healthy diet. 
	</p>
  </Modal>

  <Modal title="ContactUs" class="text-gray-800 dark:text-gray-100" bind:open={contactUs} autoclose outsideclose>
	<p class="font-medium text-lg">
		Our Headquarters
	</p>
	<p>
		118,Persiaran APEC, Cyberjaya, 63000, Cyberjaya, Selangor
	</p>
	<hr style="border-top: 2px solid rgba(0, 0, 0, 0.1); margin: 10px 0; margin-bottom:30px;" />
	<p class="font-medium text-lg">
		Our Contact Number
	</p>
	<p>
		+603-82794453
	</p>
	<hr style="border-top: 2px solid rgba(0, 0, 0, 0.1); margin: 10px 0; margin-bottom:30px;" />
	<p class="font-medium text-lg">
		Our Email
	</p>
	<p>
		Headquarters: hq@delisyok.com
	</p>
	<p>
		Human Resource: hr@delisyok.com
	</p>
	<p>
		Marketing: marketing@delisyok.com
	</p>
  </Modal>

  <Modal class="text-gray-800 dark:text-gray-100" bind:open={upgrade} autoclose outsideclose>
	<p class="text-lg font-semibold">
		We are cooking something up! Stay tune for plan and pricing updates.
	</p>
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
