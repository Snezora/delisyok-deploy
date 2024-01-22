<script>
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import TrashBin from '../cart/trash.svelte';
    import  { Button, Modal, DarkMode, Label, Textarea } from 'flowbite-svelte';
    import { page } from '$app/stores';
    import SidebarCustomer from '../../SidebarCustomer.svelte';
    import {ExclamationCircleOutline, ArrowLeftOutline, CartOutline } from 'flowbite-svelte-icons';
    let popupModal = false;


    const itemid = $page.params.menuItem;
    let userData;
    /**
	 * @type {any}
	 */
    let customerData;
    /**
	 * @type {string | undefined}
	 */
    let user_id;

    /**
	 * @type {any[][]}
	 */
    let menuItemData = []; //Here is the menu Item Data
    let sidebarOpen = false;
    /**
	 * @type {any}
	 */
    let vendorid;
    /**
	 * @type {any}
	 */
    let vendorName;
    /**
	 * @type {any}
	 */
    let customerid;
    /**
	 * @type {any}
	 */
    let remark;

    /**
	 * @type {never[]}
	 */
    let cart = [];

    async function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;
        menuItemData = await fetchMenuItemData();
        console.log(menuItemData);
        vendorid = menuItemData.vendor.vendorid;
        vendorName = menuItemData.vendor.businessname;
        console.log('im here start');
        customerData = await fetchCustomerData();
        console.log(customerData);
        customerid = customerData.customerid;
        cart = await fetchCart();
        console.log(cart);

    });

    async function fetchMenuItemData(){
        const { data, error } = await supabaseClient
        .from('menuitem')
        .select('*, vendor(*)')
        .eq('itemid', itemid);

        if (error){
            console.error('Error fetching menu item: ', error);
        } else {
            return data[0];
        }
    }

    async function fetchCustomerData(){

        const { data, error } = await supabaseClient.from('customer')
        .select('*')
        .eq('user_id', user_id);

        if (error){
            console.error('Error fetching customer name: ', error);
        } else if (data && data.length > 0){
            return data[0];
        }
    }

    async function fetchCart(){
        const { data, error } = await supabaseClient
        .from('cusorder')
        .select('*')
        .eq('customerid', customerid)
        .eq('cartstatus', 'unpaid')
        .order('ordergenerated', { ascending: false })

        if (error){
            console.error('Error creating new cart: ', error);
        } else {
            if (data[0] == null){ //If there's no record of a cart, create a cart
                const { error } = await supabaseClient
                .from('cusorder')
                .insert({
                    customerid: customerid,
                    ordergenerated: new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"}),
                    cartstatus: 'unpaid',
                })

                if (error){
                    console.error('Error creating new cart: ', error);
                } else {
                    const { data, error } = await supabaseClient
                    .from('cusorder')
                    .select('*')
                    .eq('customerid', customerid)
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

    async function addItemIntoCart(){
        const { error } = await supabaseClient
        .from('orderitem')
        .insert({
            remark,
            orderid : cart.orderid,
            itemid,
            itemprice : menuItemData.itemprice,
            itemname : menuItemData.itemname,
        })

        if (error){
            console.error('Error adding item into cart: ', error);
        } else {
            alert('Item added into cart')
            popupModal = true;
        }
    }

    async function backMenu(){
        window.location.href=`/client/dashboard/customer/${vendorid}`;
    }

    //export let data;

</script>

<div class="fixed z-10">
	{#if sidebarOpen}
		<div class="fixed">
			<SidebarCustomer />
		</div>
	{/if}
</div>

<div class="page-container min-h-[100vh] mb-10 overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-16 bg-gray-900 px-4 flex flex-row justify-between">
        <Button pill={true} outline={true} class="my-4" on:click={() => window.history.back()}>
            <ArrowLeftOutline class="w-4 h-4 text-white" />
        </Button>
        <div class="flex flex-col items-center mt-auto mb-auto">
            <div class="font-bold text-2xl text-white w-full h-9 flex items-center justify-center">
                <h1>{vendorName} Menu</h1>
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
    <div class="maincontainer grid md:grid-cols-2 lg:grid-cols-2 grid-rows-1 place-items-center w-[100%] mt-10 md:justify-between lg:justify-between sm:justify-center dark:text-white gap-5">
        <div class="leftside flex flex-col gap-5 items-center">
            <img src="https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/menuitemimage/{menuItemData.itemimage}" alt="" height="100" width="250" class="align-middle rounded-xl shadow-md justify-center"/>
            <h1 class="text-3xl font-bold text-center">{menuItemData.itemname}</h1>
            <div class="description text-center">{menuItemData.itemdescription}</div>
        </div>
        <div class="rightside w-[100%] flex flex-col items-center">
            <div class="cardcontainer bg-gray-300 w-[80%] p-5 rounded-xl flex flex-col gap-5 dark:text-black">
                <div class="text">
                    <Label for="textarea-id" class="mb-2 dark:text-black">Write your remark for the food here!</Label>
                    <Textarea id="textarea-id" placeholder="Remark" rows="8" name="message" bind:value={remark} />
                </div>
                <div class="price text-center text-xl font-bold">RM {menuItemData.itemprice}</div>
                <Button on:click={addItemIntoCart}>Add to cart</Button>
            </div>
        </div>
    </div>
</div> 

<Modal bind:open={popupModal} size="xs" autoclose>
    <div class="text-center">
      <ExclamationCircleOutline class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Item Added!</h3>
      <Button color="red" class="me-2" on:click={backMenu}>Back to Menu</Button>
      <Button color="alternative">View Cart</Button>
    </div>
</Modal>



<style>
    .titleBar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: orange;
    }
    .topSpace{
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
    }
</style>