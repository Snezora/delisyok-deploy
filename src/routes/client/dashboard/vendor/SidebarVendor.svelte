<script>

	import { Button, DarkMode, Popover } from "flowbite-svelte";
    import { hidden2 } from "../../../stores/sidebar.js"
	import { BookOpenSolid, ChartPieSolid, CompassSolid, GearSolid, MoneyBillsSolid, RightFromBracketSolid, ScrollSolid, StoreSolid } from "svelte-awesome-icons";
	import { supabaseClient } from "$lib/supabase.js";
    import { user } from "../../../stores/authStore.js";
    import { uploadingFile } from "../../../stores/businessStore.js";
    let placement;

const logout = () => {
		console.log("logged out.");
		supabaseClient.auth.signOut();
		user.set(false);
	}
</script>


<div class="text-center bg-gray-900 flex flex-col gap-3">
    <Button on:click={() => (hidden2.set(false))} on:mouseenter={() => (placement = 'right')} id="navigation" class=" p-2 m-2 w-10 h-10 ">
        <CompassSolid />
    </Button>
    <Button href="/client/dashboard/vendor" on:click={() => {uploadingFile.set(false)}} on:mouseenter={() => (placement = 'right')} id="dashboard" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <ChartPieSolid />
    </Button>
    <Button href="/client/dashboard/vendor/store" on:click={() => {uploadingFile.set(false)}} on:click={() => {uploadingFile.set(false)}}  on:mouseenter={() => (placement = 'right')} id="storefront" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <StoreSolid />
    </Button>
    <Button href="/client/dashboard/vendor/menu" on:click={() => {uploadingFile.set(false)}} on:mouseenter={() => (placement = 'right')} id="menuInfo" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <BookOpenSolid />
    </Button>
    <Button href="/client/dashboard/vendor/orders" on:click={() => {uploadingFile.set(false)}} on:mouseenter={() => (placement = 'right')} id="orderInfo" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <ScrollSolid />
    </Button>
    <!-- <Button href="" on:mouseenter={() => (placement = 'right')} id="paymentInfo" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <MoneyBillsSolid />
    </Button>
    <Button href="" on:mouseenter={() => (placement = 'right')} id="settingsInfo" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <GearSolid />
    </Button> -->
    <Button href="/"  data-sveltekit-reload on:click={() => {logout(); uploadingFile.set(false)}} on:mouseenter={() => (placement = 'right')} id="logoutInfo" class=" bg-transparent dark:bg-gray-800 p-2 m-2 w-10 h-10">
        <RightFromBracketSolid />
    </Button>
    <DarkMode class="text-primary-500 mx-2 my-4 bg-white dark:bg-gray-800 dark:text-primary-600 border dark:border-gray-800"/>
</div>


<Popover triggeredBy="#navigation" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Navigation
</Popover>
<Popover triggeredBy="#dashboard" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Dashboard
</Popover>
<Popover triggeredBy="#storefront" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Store Info
</Popover>
<Popover triggeredBy="#menuInfo" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Menu Info
</Popover>
<Popover triggeredBy="#orderInfo" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Orders
</Popover>
<!-- <Popover triggeredBy="#paymentInfo" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Payment
</Popover>
<Popover triggeredBy="#settingsInfo" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Settings
</Popover> -->
<Popover triggeredBy="#logoutInfo" placement="right" class="w-28 text-sm font-extrabold rounded text-center bg-gray-800 dark:bg-slate-100 text-white dark:text-black">
    Log out
</Popover>