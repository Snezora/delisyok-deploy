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
		Carousel
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
	let clickOutsideModal = false;

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
			<NavBrand href="/">
				<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
				<span
					class="font-plain text-3xl logo ml-[4px] self-center whitespace-nowrap dark:text-white logo"
					>DeliSyok</span
				>
			</NavBrand>
			<hr style="border-top: 2px solid rgba(243, 140, 16, 0.1); margin: 10px 0; margin-bottom:30px;" />
			<SidebarItem label="About Us" iconClass="icon-container">
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
			<SidebarItem label="Contact us">
				<svelte:fragment slot="icon">
					<MobilePhoneSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Help" on:click={() => (clickOutsideModal = true)}>
				<svelte:fragment slot="icon">
					<QuestionCircleSolid
						class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container"
					/>
				</svelte:fragment>
			</SidebarItem>
			<SidebarItem label="Upgrade" class="mb-[30px]">
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

<style>
	.logo {
		font-family: 'Monoton', sans-serif;
		color: #f38c10;
		padding: 0px;
		margin-top: 20px;
		margin-bottom: 14px;
	}
</style>
