<script>
	import { Alert, Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from 'flowbite-svelte';
	import {
		Checkbox,
		Modal,
		Label,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		Input,
	} from 'flowbite-svelte';
	import { DarkMode } from 'flowbite-svelte';
	import { SunSolid, MoonSolid } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';

	import { page } from '$app/stores';
	import { user } from '../routes/stores/authStore.js';
	import { supabaseClient } from '$lib/supabase.js';

	supabaseClient.auth.getSession().then(({ data: { session } }) => {
		const isLoggedIn = session !== null;
		user.set(isLoggedIn);
	});

	supabaseClient.auth.onAuthStateChange((_, session) => {
		const isLoggedIn = !!session?.user;
		user.set(isLoggedIn);
		if (isLoggedIn) {
			// page reactions here
		}
	});

	const logout = () => {
		console.log("logged out.");
		supabaseClient.auth.signOut();
		user.set(false);
	}




	let formModal = false;
</script>

<svelte:head>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Monoton&display=swap');
  </style>
</svelte:head>


<div>
	<Navbar fluid class=" overflow-hidden max-w-[100%] bg-gray-200">
		<NavBrand href="/">
			<!-- <img src="/images/flowbite-svelte-icon-logo.svg" class="mr-3 h-6 sm:h-9" alt="Flowbite Logo" /> -->
			<span class="self-center whitespace-nowrap dark:text-white logo sm:text-[12px] md:text-[18px] lg:text-[24px]"
				>DeliSyok</span
			>
		</NavBrand>
		<NavHamburger class=" text-right" />
		<div class="flex md:order-2 md:pl-0">
			{#if $page.url.pathname !== '/auth/login' && !$user}
				<a  href="/auth/login" class=" relative w-[100px] h-[40px] pt-1 text-center self-center rounded overflow-hidden group bg-green-500 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-green-400 transition-all ease-out duration-300">
					<span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
					<span class="relative align-middle">Sign in</span>
				  </a>
			{:else if $page.url.pathname == '/auth/login'}
				  <p> </p>
			{:else if $user}
				  <div class="flex items-center md:order-3">
					<Avatar id="avatar-menu" src="https://th.bing.com/th/id/OIP.0mo3LvAAmAa21JunZCt9qwAAAA?rs=1&pid=ImgDetMain" />
					<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
				  </div>
				  <Dropdown placement="bottom" triggeredBy="#avatar-menu">
					<DropdownHeader>
					  <span class="block text-sm">Bonnie Green</span>
					  <span class="block truncate text-sm font-medium">name@flowbite.com</span>
					</DropdownHeader>
					<DropdownItem>Dashboard</DropdownItem>
					<DropdownItem>Settings</DropdownItem>
					<DropdownItem>Earnings</DropdownItem>
					<DropdownDivider />
					<DropdownItem on:click={logout}>Sign out</DropdownItem>
				  </Dropdown>

			{/if}
			<DarkMode
				class="text-lg sm:w-[20px] sm:h-[20px] md:w-[40px] md:h-[40px]  lg:w-[60px] lg:h-[60px] self-center rounded "
				btnClass=" text-gray-500 dark:text-gray-400 self-center focus:outline-none rounded-md text-sm p-2.5 inline-flex items-center"
			>
				<svelte:fragment slot="lightIcon">
					<SunSolid class="h-7 w-7 m-2 align-middle rounded" />
				</svelte:fragment>
				<svelte:fragment slot="darkIcon">
					<MoonSolid class=" h-7 w-7 m-2 align-middle rounded" />
				</svelte:fragment>
			</DarkMode>
		</div>
		{#if $page.url.pathname !== '/auth/login'}
				<NavUl
				class="order-1"
				ulClass="flex flex-col p-4 mt-4 ml-[35px] md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium border-0"
			>
				<NavLi href="/" active={true} on:mouseover{fade}>Home</NavLi>
				<NavLi href="/about">{$user}</NavLi>
				<NavLi href="/auth/login">Navbar</NavLi>
				<NavLi href="/auth/register">Register</NavLi>
				<NavLi href="/contact">Contact</NavLi>
			</NavUl>
			{:else}
				<NavUl
				class="order-1"
				ulClass="flex flex-col p-4 mt-4 mr-[50px] md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium border-0"
			>
				<NavLi href="/" active={true} on:mouseover{fade}>Home</NavLi>
				<NavLi href="/about">About</NavLi>
				<NavLi href="/auth/login">Login</NavLi>
				<NavLi href="/auth/register">Register</NavLi>
				<NavLi href="/contact">Contact</NavLi>
			</NavUl>
		{/if}	

	</Navbar>

</div>


<style>
			.logo{
				font-family: 'Monoton', sans-serif;
				color: #F38C10;
				padding: 0px;
			}
	</style>

