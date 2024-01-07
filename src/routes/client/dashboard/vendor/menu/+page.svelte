<script>
	import { Drawer, CloseButton, Button, Card, Toggle, Spinner } from "flowbite-svelte";
    import Sidebar from '../../../../Sidebar.svelte';
	import { hidden2 } from "../../../../stores/sidebar.js";
	import SidebarVendor from "../SidebarVendor.svelte";
	import { sineIn } from "svelte/easing";
	import { ArrowRightOutline } from "flowbite-svelte-icons";
	import { PenToSquareRegular, TrashCanRegular } from "svelte-awesome-icons";
	import { supabaseClient } from "$lib/supabase";
	import { onMount } from "svelte";
	import { invalidateAll } from "$app/navigation";
	import { fade } from "svelte/transition";
	import SpinnerSet from "../../../SpinnerSet.svelte";
	import { vendorStore } from "../../../../stores/businessStore";

    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };

    /**
	 * @type {any}
	 */
    let businessname;

    /**
	 * @type {any[] | null}
	 */
    let menuitems = [];

    onMount(async () => {
        invalidateAll();
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;
        const { data, error } = await supabaseClient
            .from('vendor')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            console.error('Error fetching business name:', error);
        } else if (data && data.length > 0) {
            vendorid = data[0].vendorid;
            businessname = data[0].businessname;
        }
        menuitems = await fetchItems();
        console.log(menuitems);
    });

    async function fetchItems(){
        const { data: menuitem, error } = await supabaseClient
        .from('menuitem')
        .select('*')
        .eq('vendorid', vendorid)


        if (error) {
            console.error('Error fetching business name:', error);
        } else if (menuitem && menuitem.length > 0) {
            return menuitem;
        }
        return menuitem;
    }

    /**
	 * @param {any} itemid
	 */
    async function deleteItem(itemid){
        const { data, error } = await supabaseClient
        .from('menuitem')
        .delete()
        .eq('itemid', itemid)
        
        if (error) {
            console.error('Error deleting item:', error);
            alert('Item deleted unsuccessfully');
        } else {
            console.log('Item deleted successfully:', data);
            alert('Item deleted successfully');
            window.location.href = '/client/dashboard/vendor/menu';
        }
    }

    /**
	 * @type {string | undefined}
	 */
    let user_id;
    /**
	 * @type {{ vendorid: any; }}
	 */
    let vendorid;
    let isVendor = true;

    vendorStore.subscribe(value => {
        businessname = value.businessname;
        user_id = value.user_id;
    }) //CONTINUE HERE

</script>

<SpinnerSet />

<div class="pagecontainer h-[100vh] w-[100%] flex flex-row mobile-content bg-gray-500">
    <SidebarVendor />
    <div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937] ">
        <Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
            <div class="flex items-center">
              <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase rounded">Navigation</h5>
              <CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
            </div>
        <Sidebar {isVendor} />
        </Drawer>
    </div>

    <div class="maincontainer w-[100%] flex flex-col">
        <div class="title flex justify-center items-center text-2xl font-bold bg-orange-900 text-white h-[50px]">{businessname} Menu</div>
        <div class="additembar bg-gray-300 dark:bg-gray-600 p-2 flex justify-end">
            <Button color="green" href="/client/dashboard/vendor/menu/additem" >Add Item</Button>
        </div>
        <div class="cardcontainer grid lg:grid-cols-3 md:grid-flow-row justify-center place-self-center gap-8 my-7 ">
            {#each menuitems as item}
            <Card img="" class="mb-4 bg-gray-100 dark:bg-gray-800 flex justify-between">
                <div class="textcontainer justify-start">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{item.itemname}</h5>
                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight overflow-y-hidden max-h-[40px]">{item.itemdescription}</p>
                </div>
                <div class="buttoncard flex justify-end gap-3">
                    <Button color="blue" class="dark:bg-blue-900" href="/client/dashboard/vendor/menu/{item.itemid}/edit">
                        <PenToSquareRegular class=" w-4.5  text-white" />
                    </Button>
                    <Button color="red" class="dark:bg-red-900" on:click={() => deleteItem(item.itemid)}>
                        <TrashCanRegular class=" w-4.5  text-white" />
                    </Button>
                </div>
            </Card>
            {/each}
        </div>
    </div>
    
    </div>
