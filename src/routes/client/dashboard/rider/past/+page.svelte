<script>
	import { Drawer, CloseButton, Accordion, AccordionItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { hidden2 } from "../../../../stores/sidebar";
	import SidebarRider from "../SidebarRider.svelte";
	import Sidebar from "../../../../Sidebar.svelte";
	import { sineIn } from "svelte/easing";
	import { onMount } from "svelte";
	import { supabaseClient } from "$lib/supabase";
	import SpinnerSet from "../../../SpinnerSet.svelte";

    let isRider = true;
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    /**
	 * @type {string | undefined}
	 */
    let user_id;
    /**
	 * @type {never[]}
	 */
    let riderData = [];
    let riderid;
    /**
	 * @type {any[] | undefined}
	 */
    let completedOrders = [];

    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

        riderData = await fetchRiderInfo();
        console.log(riderData);
        riderid = riderData.riderid;
        console.log(riderid);
        completedOrders = await fetchCompletedOrders();
        console.log(completedOrders);

        const channels = supabaseClient
			.channel('custom-update-channel')
			.on('postgres_changes', { event: '*', schema: 'public', table: 'sale', filter: `riderid=eq.${riderid}` }, (payload) => {
				window.location.reload();
			})
			.subscribe();
    })

    async function fetchRiderInfo() {
        let riderData;
        // Fetch the rider from the deliveryrider table
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

    async function fetchCompletedOrders(){
        const { data, error } = await supabaseClient
        .from('sale')
        .select('*, cusorder(*)')
        .eq('riderid', riderid)
        .in('deliverystatus', ['completed'])

        if (error) {
            console.error('Error fetching orders:', error);
        } else {
            return data;
        }
    }

    function formatDate(dateString) {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const formattedDate = new Date(dateString).toLocaleString("en-GB", options);
    return formattedDate;
  }

  /**
	 * @param {any} orderid
	 */
  function gotoPage(orderid){
    window.location.href=`/client/orders/${orderid}`;
  }
</script>

<SpinnerSet />

<div class="pagecontainer w-[100%] max-w-[100%] flex flex-row mobile-content min-h-[100lvh] bg-white dark:bg-gray-600">
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
    <div class="maincontainer w-[100%] min-h-[100%] flex flex-col dark:text-white">
        <div class="realheader bg-black text-white font-bold h-[50px] w-[100%] flex justify-between items-center ">
            <div class="lg:text-[24px] md:text-[16px] ml-auto mr-auto ">DELISYOK DELIVERY RIDER CLIENT</div>
        </div>
        <div class="mainmaincontainer w-[100%] flex flex-col p-6">
            <div class="pasttitle text-xl font-bold">Past Orders:</div>
            <div class="subtitle">Click on each order to view details</div>
            <div class="pastorders sm:w-[100%] lg:w-[70%] lg:self-center my-6  p-0">
                <Table hoverable={true} color="red">
                    <TableHead>
                      <TableHeadCell>Order ID</TableHeadCell>
                      <TableHeadCell>Time Created</TableHeadCell>
                    </TableHead>
                    <TableBody class="divide-y">
                        {#each completedOrders as order}
                            <TableBodyRow on:click={() => (gotoPage(order.cusorder.orderid))} class="hover:cursor-pointer">
                                <TableBodyCell>{order.cusorder.orderid}</TableBodyCell>
                                <TableBodyCell>{formatDate(order.receiptgenerated)}</TableBodyCell>
                            </TableBodyRow>
                        {/each}
                    </TableBody>
                  </Table>
            </div>
        </div>
    </div>
</div>