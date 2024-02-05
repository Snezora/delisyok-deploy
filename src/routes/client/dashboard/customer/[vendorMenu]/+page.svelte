<script>
	import { Button, DarkMode, Modal } from 'flowbite-svelte';
    import { page } from '$app/stores';
	import { supabaseClient } from '$lib/supabase';
	import { onMount } from 'svelte';
	import SidebarCustomer from '../SidebarCustomer.svelte';
	import { ArrowLeftOutline, CartOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { slide, fade } from 'svelte/transition';


    const vendorid = $page.params.vendorMenu;
    /**
	 * @type {string | undefined}
	 */
    let user_id; //Customer ID
    /**
	 * @type {never[]}
	 */
    let customerInfo = [];
    /**
	 * @type {never[]}
	 */
    let vendorInfo = []; //Vendor Information
	/**
	 * @type {any[] | undefined}
	 */
    let vendorMenu = [];
    let cart = [];
    let sidebarOpen = false;
    /**
	 * @type {string}
	 */
    let vendoropdays;
    let popupModal = false;

    async function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
        customerInfo = await fetchCustomerData();
        vendorInfo = await getVendor();
        vendorMenu = await getMenu();
        vendoropdays = getDays();
        cart = await fetchCart();
    })

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
    }   


    async function getVendor(){
        const {data, error} = await supabaseClient
        .from('vendor')
        .select('*')
        .eq('vendorid', vendorid);

        if (error) {
            console.error('Error fetching vendor:', error);
        } else {
            return data[0];
        }
    }

    async function getMenu(){
        const {data, error} = await supabaseClient
        .from('menuitem')
        .select('*')
        .eq('vendorid', vendorid);

        if (error) {
            console.error('Error fetching menu:', error);
        } else{
            return data;
        }
    }

    /**
	 * @param {any} itemid
	 */
    function goToItemPage(itemid){
        window.location.href = `/client/dashboard/customer/${vendorid}/${itemid}`
    }

    function formatTime(time) {
        const formattedTime = new Date(`2000-01-01T${time}`); // Use an arbitrary date for parsing
        return formattedTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    function getDays(){
        const days = [];
        if (vendorInfo.businessopday.includes("Monday")) {
        days.push("Monday");
        }
        if (vendorInfo.businessopday.includes("Tuesday")) {
        days.push("Tuesday");
        }
        if (vendorInfo.businessopday.includes("Wednesday")) {
        days.push("Wednesday");
        }
        if (vendorInfo.businessopday.includes("Thursday")) {
        days.push("Thursday");
        }
        if (vendorInfo.businessopday.includes("Friday")) {
        days.push("Friday");
        }
        if (vendorInfo.businessopday.includes("Saturday")) {
        days.push("Saturday");
        }
        if (vendorInfo.businessopday.includes("Sunday")) {
        days.push("Sunday");
        }
        return days.join(", ");

    }

    async function fetchCart() {
        const { data, error } = await supabaseClient
        .from('cusorder')
        .select('*')
        .eq('customerid', customerInfo.customerid)
        .eq('cartstatus', 'unpaid')
        .order('ordergenerated', { ascending: false })

        if (error){
            console.error('Error creating new cart: ', error);
        } else {
            if (data[0] == null){ //If there's no record of a cart, create a cart
                const { error } = await supabaseClient
                .from('cusorder')
                .insert({
                    customerid: customerInfo.customerid,
                    ordergenerated: new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"}),
                    cartstatus: 'unpaid',
                })

                if (error){
                    console.error('Error creating new cart: ', error);
                } else {
                    const { data, error } = await supabaseClient
                    .from('cusorder')
                    .select('*')
                    .eq('customerid', customerInfo.customerid)
                    .eq('cartstatus', 'unpaid')
                    .order('ordergenerated', { ascending: false })

                    if (error){
                        console.error('Error creating new cart: ', error);
                    } else {
                        return data[0];
                    }
                }
            } else {
                return data[0];
            }
        }
    }

    
    //To access the menuItem pages, do this href="/client/dashboard/customer/{vendorid}/{itemid}"
</script>

<div class="fixed z-10">
	{#if sidebarOpen}
		<div class="fixed">
			<SidebarCustomer />
		</div>
	{/if}
</div>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-16 bg-gray-900 px-4 flex flex-row justify-between">
        <Button pill={true} outline={true} class="my-4" on:click={() => (popupModal = true)}>
            <ArrowLeftOutline class="w-4 h-4 text-white" />
        </Button>
        <div class="flex flex-col items-center ">
            <div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
                <h1>{vendorInfo.businessname}</h1>
            </div>
    
            <div class="text-base text-white w-full h-8 flex items-center justify-center">
                <h1>Menu</h1>
            </div>
        </div>
        <div class="rightside gap-3 flex flex-row">
            <DarkMode class="h-[60%] mt-auto mb-auto"></DarkMode>
            <Button pill={true} outline={true} class="my-4" on:click={() => (window.location.href=`/client/dashboard/customer/${vendorid}/cart/`)}>
                <CartOutline class="w-4 h-4 text-white" />
            </Button>
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
    <div class="vendorinfo md:pt-5 lg:pt-5 pt-[50px] py-5 bg-gray-300 flex flex-wrap md:flex-wrap lg:flex-row justify-around gap-x-10 dark:bg-red-900 dark:text-white font-bold" >
        <div class="businessdescription overflow-auto items-center text-center">
            <h1>Business Description: {vendorInfo.storedescription}</h1>
            <div class="hours">Operating Hours: {formatTime(vendorInfo.businessstarttime)} - {formatTime(vendorInfo.businessclosingtime)}</div>
        </div>
        <div class="businessinfo flex flex-col items-center">
            <div class="opdays">Operating Days: </div>
            <div class="realopdays">{vendoropdays}</div>
        </div>
    </div>
    <div class="menucontainer grid md:grid-cols-2 lg:grid-cols-2 grid-rows-1 place-items-center p-5 gap-5">
        {#each vendorMenu as menuItem}
        <div class="card h-[122px] w-[100%] border-black border hover:cursor-pointer hover:bg-gray-200 dark:bg-gray-600 dark:border-orange-500 dark:text-white hover:dark:bg-gray-500" in:slide out:fade>        
            <a class="flex flex-row h-[120px] w-[100%]" on:click={() => goToItemPage(menuItem.itemid)} href="#"><img src="https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/menuitemimage/{menuItem.itemimage}" alt="" height="100" width="120" class="align-middle"/> 
                <div class="iteminfo w-[100%] flex flex-col  justify-around">
                    <h1 class="text-xl font-bold text-center">{menuItem.itemname}</h1>
                    <h1 class="text-xl font-bold text-center">RM {menuItem.itemprice}</h1>
                </div>
            </a>
        </div>
        {/each}
    </div>
</div>

<Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-red-500" />
        <h3 class="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to go back?</h3>
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400"> This will delete your cart</h3>
      <Button color="red" class="me-2" on:click={() => (window.location.href="/client/dashboard/customer/")}>Yes, I'm sure</Button>
      <Button color="alternative" on:click={(() => (popupModal = false))}>No, cancel</Button>
    </div>
</Modal>