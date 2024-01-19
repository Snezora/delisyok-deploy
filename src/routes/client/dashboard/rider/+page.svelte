<script>
	import { confirmed } from './../../../stores/deliveryRider.js';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import SidebarRider from './SidebarRider.svelte';
	import { Button, CloseButton, Drawer, Toggle, DarkMode } from 'flowbite-svelte';
	import { hidden2 } from '../../../stores/sidebar';
    import Sidebar from '../../../Sidebar.svelte';
	import { sineIn } from 'svelte/easing';

    /**
	 * @type {string | undefined}
	 */
    let user_id;
    let riderData = [];
    let isRider = true;

    /**
	 * @type {boolean}
	 */
    let checkFuel = false;
    /**
	 * @type {boolean}
	 */
    let checkBag = false;
    /**
	 * @type {boolean}
	 */
    let checkBattery = false;

    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };



onMount(async () => {
    const userLog = await supabaseClient.auth.getUser();
    user_id = userLog.data.user?.id;

    riderData = await fetchRiderInfo();
    console.log(riderData);
    confirmed.set({
        fuel: false,
        bag: false,
        battery: false
    })

    confirmed.subscribe(value => {
        checkFuel = value.fuel;
        checkBag = value.bag;
        checkBattery = value.battery;
    })
})

async function fetchRiderInfo() {
    let riderData;

    // Fetch the businessname from the vendor table
    const { data, error } = await supabaseClient
    .from('deliveryrider')
    .select('*')
    .eq('user_id', user_id);

    if (error) {
    console.error('Error fetching business name:', error);
    } else if (data && data.length > 0) {
        riderData = data[0];
    }
    return riderData;
}

async function updateConfirm(){
    confirmed.set({
        fuel: true,
        bag: true,
        battery: true
    })
}
</script>

<!-- <div class="pagecontainer w-[100%] flex flex-row mobile-content h-[100vh]">
    <SidebarRider />
    <div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937] ">
        <Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
            <div class="flex items-center">
              <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase rounded">Navigation</h5>
              <CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
            </div>
        <Sidebar {isRider} />
        </Drawer>
    </div>
    <div class="maincontainer w-[100%]">
        <div class="header text-center">text</div>
    </div>
</div> -->

<div class="pagecontainer w-[100%] min-h-[100lvh]">
    <div class="realheader bg-black text-white font-bold h-[50px] flex justify-between items-center text-[24px]">
        <div class="text lg:text-[24px] md:text-[16px] ml-auto mr-auto">    DELISYOK DELIVERY RIDER CLIENT
        </div>
        <DarkMode class=""></DarkMode>
    </div>
    <div class="pagecontainer w-[100%] min-h-[100lvh] flex flex-col mobile-content bg-gray-600">
        <div class="header text-4xl w-[100%] text-center p-10 text-white font-semibold">
            Hello, {riderData.ridername}. Welcome to your Delivery Rider dashboard.
        </div>
        <div class="subheader text-2xl w-[100%]  text-center text-white p-10">
            We just want to make sure a few things before you start:
        </div>
        <div class="togglearea flex flex-col gap-5 self-center p-10">
            <Toggle class="text-xl text-white " bind:checked={checkFuel}>Enough Fuel in Your Vehicle?</Toggle>
            <Toggle class="text-xl text-white " bind:checked={checkBattery}>Is Your Phone Charged?</Toggle>
            <Toggle class="text-xl text-white " bind:checked={checkBag}>Do You Have a Delivery Bag?</Toggle>
        </div>
        {#if checkFuel && checkBattery && checkBag}
        <div class="buttonarea self-center p-10">
            <Button href="/client/dashboard/rider/orders" on:click={updateConfirm}>Proceed to Orders</Button>
        </div>
        {:else}
        <div class="buttonarea self-center p-10">
            <Button disabled>Proceed to Orders</Button>
        </div>
        {/if}
    </div>
</div>
