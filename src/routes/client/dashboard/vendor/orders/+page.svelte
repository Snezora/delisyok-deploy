<script>
	import { Drawer, CloseButton, Button, Card, Toggle, Spinner, Accordion, AccordionItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, ImagePlaceholder, Modal } from "flowbite-svelte";
    import Sidebar from '../../../../Sidebar.svelte';
	import { hidden2 } from "../../../../stores/sidebar.js";
	import SidebarVendor from "../SidebarVendor.svelte";
	import { sineIn } from "svelte/easing";
	import { ArrowRightOutline, CogOutline, ExclamationCircleOutline, ShoppingCartSolid } from "flowbite-svelte-icons";
	import { PenToSquareRegular, TrashCanRegular } from "svelte-awesome-icons";
	import { supabaseClient } from "$lib/supabase";
	import { onMount } from "svelte";
    import { fade, slide } from 'svelte/transition';
	import SpinnerSet from "../../../SpinnerSet.svelte";
	import { vendorStore } from "../../../../stores/businessStore";


    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };

    /**
	 * @type {string}
	 */
    let time;

    let isVendor = true;
    let businessname;
    let user_id;
    /**
	 * @type {string}
	 */
    let vendorid;
    let newOrders;
    /**
	 * @type {any[] | undefined}
	 */
    let currentOrders;
    /**
	 * @type {any[] | undefined}
	 */
    let pastOrders;

    let openConfirm = false;


    onMount(async () => {
        let currentTime = new Date();
        let hours = currentTime.getHours().toString().padStart(2, '0');
        let minutes = currentTime.getMinutes().toString().padStart(2, '0');
        let seconds = currentTime.getSeconds().toString().padStart(2, '0');
        time = hours + ":" + minutes + ":" + seconds;

        // Check if the user is signed in
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

        // Fetch the vendorid from the vendor table
        const { data, error } = await supabaseClient
            .from('vendor')
            .select('vendorid')
            .eq('user_id', user_id);

        if (data) {
          vendorid = data[0].vendorid;
        } else {
          console.error('Error fetching business name:', error);
        }

        newOrders = await getNewOrders();
        currentOrders = await getCurrentOrders();
        pastOrders = await getPastOrders();

        const channels = supabaseClient
			  .channel('custom-update-channel')
			  .on('postgres_changes', { event: '*', schema: 'public', table: 'sale', filter: `vendorid=eq.${vendorid}` }, (payload) => {
				  window.location.reload();
			  })
			  .subscribe();
    })

    async function getNewOrders() {
      let realData;

        const { data, error } = await supabaseClient
        .from('sale')
        .select('*, cusorder(*, customer(*))')
        .eq('vendorid', vendorid)
        .eq('vendororderstatus', 'pending')
        .order('receiptgenerated', { ascending: false });
        
        if (error) {
            console.error('Error fetching orders:', error);
        }
        else{
            realData = data;
        }
        return realData;
    }

    async function getCurrentOrders() {
      let realData;

      const { data, error } = await supabaseClient
        .from('sale')
        .select('*, cusorder(*, customer(*))')
        .eq('vendorid', vendorid)
        .eq('vendororderstatus', 'ongoing')
        .order('receiptgenerated', { ascending: false });
        
        if (error) {
            console.error('Error fetching orders:', error);
        }
        else{
            realData = data;
        }
        return realData;
    }

    async function getPastOrders() {
      let realData;

      const { data, error } = await supabaseClient
        .from('sale')
        .select('*, cusorder(*, customer(*))')
        .eq('vendorid', vendorid)
        .in('vendororderstatus', ['completed', 'rejected'])
        .order('receiptgenerated', { ascending: false });
        
        if (error) {
            console.error('Error fetching orders:', error);
        }
        else{
            realData = data;
        }
        return realData;
    }

    /**
	 * @param {any} saleid
	 */
    async function approveNewOrder(saleid) {
        const { data, error } = await supabaseClient
        .from('sale')
        .update({ vendororderstatus: 'ongoing' })
        .eq('saleid', saleid);

        if (error) {
            console.error('Error updating order status:', error);
        } else {
          alert("Order has been confirmed!");
          location.reload();
        }
    }

    /**
	 * @param {any} saleid
	 */
    async function rejectNewOrder(saleid) {
        const { data, error } = await supabaseClient
        .from('sale')
        .update({ vendororderstatus: 'rejected' })
        .eq('saleid', saleid);

        if (error) {
            console.error('Error updating order status:', error);
        } else {
          alert("Order has been rejected!");
          location.reload();
        }
    }

        /**
	 * @param {any} saleid
	 */
   async function completeNewOrder(saleid) {
        const { data, error } = await supabaseClient
        .from('sale')
        .update({ vendororderstatus: 'completed' })
        .eq('saleid', saleid);

        if (error) {
            console.error('Error updating order status:', error);
        } else {
          alert("Order has been completed!");
          location.reload();
        }
    }

    let popupModal = false;
    /**
	 * @type {never[] | null}
	 */
    let selectedSale = [];
    /**
	 * @type {any[]}
	 */
    let orderItems = [];

    async function togglePopupModal(saleid) {
        popupModal = !popupModal;

        let selectedOrderID;

        const {data, error} = await supabaseClient
        .from('sale')
        .select('*, cusorder(*, orderitem(*))')
        .eq('saleid', saleid)
        .single();

        if (error) {
            console.error('Error fetching order details: ', error);
        } else {
          selectedSale = data;
          selectedOrderID = data.cusorder.orderid;

          const {data: orderdetails, error: orderdetailserror} = await supabaseClient
          .from('orderitem')
          .select('*')
          .eq('orderid', selectedOrderID);

          if (orderdetailserror) {
              console.error('Error fetching order details: ', orderdetailserror);
          } else {
            orderItems = orderdetails;
          }
          console.log(selectedSale);
        }
    }

    async function toggleConfirmModal(saleid) {
        openConfirm = !openConfirm;

        let selectedOrderID;

        const {data, error} = await supabaseClient
        .from('sale')
        .select('*, cusorder(*, orderitem(*))')
        .eq('saleid', saleid)
        .single();

        if (error) {
            console.error('Error fetching order details: ', error);
        } else {
          selectedSale = data;
          selectedOrderID = data.cusorder.orderid;

          const {data: orderdetails, error: orderdetailserror} = await supabaseClient
          .from('orderitem')
          .select('*')
          .eq('orderid', selectedOrderID);

          if (orderdetailserror) {
              console.error('Error fetching order details: ', orderdetailserror);
          } else {
            orderItems = orderdetails;
          }
          console.log(selectedSale);
        }
    }

</script>

<SpinnerSet />

<div class="pagecontainer w-max-[100%] flex flex-row mobile-content bg-white dark:bg-gray-800">

    <div class="maincontainer flex flex-col w-[100%] order-2">
        <div class="topsection">
            <div class="title flex justify-center items-center text-2xl font-bold bg-orange-900 text-white h-[50px]">Orders</div>
            <div class="subtitle flex justify-center items-center lg:text-xl text-[16px] font-bold bg-blue-700 text-white h-[50px] gap-5">
                Last Refreshed: {time} GMT+8
                <Button on:click={() => location.reload()} color="red"> Refresh </Button>
            </div>
        </div>
        <div class="middlesection py-10 px-5">
            <Accordion multiple={true} inactiveClass="text-gray-500 dark:text-gray-200 hover:bg-gray-100 hover:dark:bg-gray-800" class="w-max-[100%] overflow-auto">
                <AccordionItem open>
                  <span slot="header" class="text-base flex gap-2">
                    <ShoppingCartSolid class="mt-0.5" />
                    <span>New Orders</span>
                  </span>
                  {#if newOrders?.length > 0}
                  <Table hoverable={true} class=" text-left text-sm text-gray-500 dark:text-gray-400">
                    <TableHead>
                      <TableHeadCell>Order ID</TableHeadCell>
                      <TableHeadCell>Time Generated</TableHeadCell>
                      <TableHeadCell>Customer Name</TableHeadCell>
                      <TableHeadCell>Total Price</TableHeadCell>
                      <TableHeadCell>
                        <span class="sr-only">Complete</span>
                      </TableHeadCell>
                      <TableHeadCell>
                        <span class="sr-only">Reject</span>
                      </TableHeadCell>
                      <TableHeadCell>
                        <span class="sr-only">View</span>
                      </TableHeadCell>
                    </TableHead>
                    <TableBody class="divide-y">
                      {#each newOrders as order}
                        <TableBodyRow>
                          <TableBodyCell>{order.cusorder.orderid}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.ordergenerated}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.customer.customername}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.foodtotalprice}</TableBodyCell>
                          <TableBodyCell>
                            <a on:click={() => approveNewOrder(order.saleid)} class="font-medium text-green-500 hover:underline dark:text-green-500">Accept</a>
                          </TableBodyCell>
                          <TableBodyCell>
                            <a on:click={() => rejectNewOrder(order.saleid)} class="font-medium text-red-600 hover:underline dark:text-red-600">Reject</a>
                          </TableBodyCell>
                          <TableBodyCell>
                            <a on:click={() => togglePopupModal(order.saleid)} class="font-medium text-primary-600 hover:underline dark:text-primary-500">View Order</a>
                          </TableBodyCell>
                        </TableBodyRow>
                      {/each}
                    </TableBody>
                  </Table>
                  {:else}
                    No current orders.
                  {/if}
                </AccordionItem>

                <!-- CURRENT ORDERS -->
                <AccordionItem open>
                  <span slot="header" class="text-base flex gap-2">
                    <ShoppingCartSolid class="mt-0.5" />
                    <span>Ongoing Orders</span>
                  </span>
                  {#if currentOrders?.length > 0}
                  <Table hoverable={true} class=" text-left text-sm text-gray-500 dark:text-gray-400">
                    <TableHead>
                      <TableHeadCell>Order ID</TableHeadCell>
                      <TableHeadCell>Time Generated</TableHeadCell>
                      <TableHeadCell>Customer Name</TableHeadCell>
                      <TableHeadCell>Total Price</TableHeadCell>
                      <TableHeadCell>
                        <span class="sr-only">Complete</span>
                      </TableHeadCell>
                      <TableHeadCell>
                        <span class="sr-only">View</span>
                      </TableHeadCell>
                    </TableHead>
                    <TableBody class="divide-y">
                      {#each currentOrders as order}
                        <TableBodyRow>
                          <TableBodyCell>{order.cusorder.orderid}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.ordergenerated}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.customer.customername}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.foodtotalprice}</TableBodyCell>
                          <TableBodyCell>
                            <a on:click={() => (toggleConfirmModal(order.saleid))} class="font-medium text-green-600 hover:underline dark:text-green-500">Complete</a>
                          </TableBodyCell>
                          <TableBodyCell>
                            <a on:click={() => togglePopupModal(order.saleid)} class="font-medium text-primary-600 hover:underline dark:text-primary-500">View Order</a>
                          </TableBodyCell>
                        </TableBodyRow>
                      {/each}
                    </TableBody>
                  </Table>
                  {:else}
                    No current orders.
                  {/if}

                </AccordionItem>
                <!-- PAST ORDERS -->
                <AccordionItem open>
                  <span slot="header" class="text-base flex gap-2">
                    <CogOutline class="mt-0.5" />
                    <span>Past Orders</span>
                  </span>
                  {#if pastOrders?.length > 0}
                  <Table hoverable={true} class=" text-left text-sm text-gray-500 dark:text-gray-400">
                    <TableHead>
                      <TableHeadCell>Order ID</TableHeadCell>
                      <TableHeadCell>Time Generated</TableHeadCell>
                      <TableHeadCell>Customer Name</TableHeadCell>
                      <TableHeadCell>Total Price</TableHeadCell>
                      <TableHeadCell>
                        <span class="sr-only">View</span>
                      </TableHeadCell>
                    </TableHead>
                    <TableBody class="divide-y">
                      {#each pastOrders as order}
                        <TableBodyRow>
                          <TableBodyCell>{order.cusorder.orderid}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.ordergenerated}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.customer.customername}</TableBodyCell>
                          <TableBodyCell>{order.cusorder.foodtotalprice}</TableBodyCell>
                          <TableBodyCell>
                            <a on:click={() => togglePopupModal(order.saleid)} class="font-medium text-primary-600 hover:underline dark:text-primary-500">View Order</a>
                          </TableBodyCell>
                        </TableBodyRow>
                      {/each}
                    </TableBody>
                  </Table>
                  {:else}
                    No past orders.
                  {/if}
         
                </AccordionItem>
              </Accordion>
        </div>

    </div>
    <div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937] ">
      <Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
          <div class="flex items-center">
            <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase rounded">Navigation</h5>
            <CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
          </div>
      <Sidebar {isVendor} />
      </Drawer>
    </div>    
    <SidebarVendor class=" order-1"/>

    <Modal bind:open={popupModal} size="xs" autoclose>
      {#if selectedSale != null}
      <div class="text-center">
        <h3 class="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">
          Sale ID: {selectedSale.saleid}
        </h3>
        <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
          These are the food items:
        </h3>
        <hr class="border-black w-[100%] mt-2 mb-2">
      {#each orderItems as food}
      <div class="text flex flex-col gap-2">
        <p>Food ID: {food.itemid}</p>
        <p>Food Name: {food.itemname}</p>
        <p>Food Remark: {food.remark}</p>
      </div>
      <hr class="border-black w-[100%] mt-2 mb-2">
      {/each}
      </div>
      {/if}
    </Modal>

    <Modal bind:open={openConfirm} size="xs" autoclose>
      <div class="text-center flex flex-col gap-3">
        <ExclamationCircleOutline class="mx-auto mb-4 text-red-500 w-12 h-12 dark:text-red-500" />
        <h3 class="mb-1 text-lg font-normal text-gray-500 dark:text-gray-400">
          Confirm Order #{selectedSale.orderid}?
        </h3>
        <div class="buttons">
          <Button
          color="red"
          class="me-2"
          on:click={() => (completeNewOrder(selectedSale.saleid))}>Yes, I'm sure</Button
        >
        <Button color="alternative" on:click={() => (openConfirm = false)}>No, cancel</Button>
        </div>
      </div>
    </Modal>

</div>


