<script>
// @ts-nocheck

    /** @type {import('./$types').PageData} */

    import { onMount } from 'svelte';
    import { goto, invalidate } from '$app/navigation';
    import { supabaseClient } from '$lib/supabase.js';
    import Sidebar from '../../../Sidebar.svelte';
    import { writable } from 'svelte/store';
    import { Card, Drawer, Spinner, Button, CloseButton, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, DarkMode, Chart, A, Dropdown, DropdownItem } from 'flowbite-svelte';
    import { ChartPieSolid, ShoppingCartSolid, GridSolid, MailBoxSolid, UsersSolid, BagSolid, ArrowRightToBracketSolid, FileEditSolid, ChevronRightSolid, ChevronDownSolid } from 'flowbite-svelte-icons';
    import { CircleCheckRegular, CircleXmarkRegular, CompassSolid, MoneyBill1Regular, WheelchairMoveSolid } from 'svelte-awesome-icons';
    import { sineIn } from 'svelte/easing';
	import { fail } from '@sveltejs/kit';
	import { supabase } from '@supabase/auth-ui-shared';
    import SidebarVendor from './SidebarVendor.svelte';
    import { hidden2 } from '../../../stores/sidebar.js';
    import { fade } from 'svelte/transition';
	import SpinnerSet from '../../SpinnerSet.svelte';
	import { vendorStore, uploadingFile } from '../../../stores/businessStore';



    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };

    let user_id;
    /**
	 * @type {any}
	 */
    let vendorData;
    /**
	 * @type {any}
	 */
    let businessname;
    /**
	 * @type {any}
	 */
    let businessstarttime;

    let successfulOrder = 2;
    let failedOrder = 1;
    let totalSales = 300;

    /**
	 * @type {any[]}
	 */
    let orders;
    let isVendor = true;



    onMount(async () => {
        uploadingFile.set(false);
        vendorData = await fetchBusinessName();
        console.log(vendorData);
        businessname = vendorData.businessname;
        businessstarttime = vendorData.businessstarttime;
        orders = await getOrders();
        console.log(orders)
        
    });

    let options = {
    chart: {
      height: '180px',
      maxWidth: '100%',
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      dropShadow: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: '#1C64F2',
        gradientToColors: ['#1C64F2']
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 6
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: 0
      }
    },
    series: [
      {
        name: 'New users',
        data: [6500, 6418, 6456, 6526, 6356, 6456],
        color: '#1A56DB'
      }
    ],
    xaxis: {
      categories: ['01 February', '02 February', '03 February', '04 February', '05 February', '06 February', '07 February'],
      labels: {
        show: false
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false
    }
  };


    async function fetchBusinessName() {
        // Check if the user is signed in
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

        // Fetch the businessname from the vendor table
        const { data, error } = await supabaseClient
            .from('vendor')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            console.error('Error fetching business name:', error);
        } else if (data && data.length > 0) {
            vendorData = data[0];
        }
        return vendorData;
    }

    async function getOrders() {
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;
        /**
		 * @type {any[]}
		 */
        let order = [];

        const { data, error } = await supabaseClient
            .from('vendor')
            .select('vendorid')
            .eq('user_id', user_id);

        // @ts-ignore
        const vendorid = data[0].vendorid;
        // @ts-ignore
        console.log(vendorid);

        if (error) {
            console.error('Error fetching vendor info: ', error);
        } else if (data && data.length > 0) {
            const { data, error } = await supabaseClient
                .from('sale')
                .select('*')
                .eq('vendorid', vendorid)
                .order('receiptgenerated', { ascending: false });

            if (error) {
                console.error('Error fetching orders: ', error);
            } else if (data && data.length > 0) {
                for (let index = 0; index < data.length; index++) {
                    order.push(data[index]);
                }
            }
            return order;
        }
        return order;
    }

    vendorStore.subscribe((value) => {
        businessname = value.businessname;
    });

</script>

<SpinnerSet />

<div class="pagecontainer w-[100%] flex flex-row mobile-content h-[100vh]">
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
    <div class=" flex flex-col w-[100%] bg-slate-300 overflow-x-hidden">
        <div class="bg-white dark:bg-pdark-100 h-[100px] text-center flex items-center p-3">
            <div class="flex flex-col">
                <div class="text-3xl font-bold flex justify-start dark:text-white">Welcome, {businessname}.</div>
                <div class="justify-start dark:text-[#FFEBE0]">See how your restaurant is doing on our application!</div>
            </div>
        </div>
        <div class=" w-[100%] text-center p-2 bg-yellow-200 dark:bg-red-500 dark:text-white font-bold">Today's stats</div>
        <div class="flex flex-wrap w-[100%] p-3 justify-around gap-5 dark:bg-slate-500">
            <Card class=" w-[280px]">
                <div class="flex flex-row">
                    <div class="flex items-center justify-center pr-5">
                        <CircleCheckRegular size="50" color="green"/>
                    </div>
                    <div class="flex flex-col">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{successfulOrder}</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
                            {#if successfulOrder > 1}
                                Successful Orders
                            {:else}
                                Successful Order
                            {/if}
                        </p>
                    </div>
                </div>
            </Card>
            <Card class=" w-[280px]">
                <div class="flex flex-row">
                    <div class="flex items-center justify-center pr-5">
                        <CircleXmarkRegular color="red" size="50" />
                    </div>
                    <div class="flex flex-col">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{failedOrder}</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">
                            {#if failedOrder > 1 || failedOrder === 0}
                                Failed Orders
                            {:else}
                                Failed Order
                            {/if}
                        </p>
                    </div>
                </div>
            </Card>
            <Card class=" w-[280px]">
                <div class="flex flex-row">
                    <div class="flex items-center justify-center pr-5">
                        <MoneyBill1Regular color="green" size="50" />
                    </div>
                    <div class="flex flex-col">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">RM {totalSales}</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">Total Earned</p>
                    </div>
                </div>
            </Card>
        </div>
        
        <div class=" h-[100%] w-[100%] p-3 flex flex-wrap justify-around items-center px-10 desktop-content bg-white dark:bg-pdark-100 gap-3">
            <div class="tableContainer">
                <h2 class="font-bold">Recent 3 Orders:</h2>
                <Table striped={true} color="green" hoverable={true}>
                    <TableHead>
                        <TableHeadCell>Order ID</TableHeadCell>
                        <TableHeadCell>Time Generated</TableHeadCell>
                        <TableHeadCell>Status</TableHeadCell>
                        <TableHeadCell>
                          <span class="sr-only">Edit</span>
                        </TableHeadCell>
                    </TableHead>
                      <TableBody>
                        {#if orders}
                            {#each orders.slice(0,3) as order}
                                {#if order}
                                    <TableBodyRow>
                                        <TableBodyCell>{order.orderid}</TableBodyCell>
                                        <TableBodyCell>{order.receiptgenerated}</TableBodyCell>
                                        <TableBodyCell class="capitalize">{order.vendororderstatus}</TableBodyCell>
                                        <TableBodyCell>
                                        <a href="/client/orders/{order.orderid}" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Details</a>
                                        </TableBodyCell>
                                    </TableBodyRow>
                                {/if}
                            {/each}
                        {:else}
                        <TableBodyRow>
                            <TableBodyCell>NO ORDERS YET</TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell>NO ORDERS YET</TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                        </TableBodyRow>
                        <TableBodyRow>
                            <TableBodyCell>NO ORDERS YET</TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                            <TableBodyCell></TableBodyCell>
                        </TableBodyRow>
                        {/if}
                      </TableBody>
                </Table>
            </div>
            <div class="earning-container">
                <Card>
                    <div class="flex justify-between">
                      <div>
                        <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">RM 3210.20</h5>
                        <p class="text-base font-normal text-gray-500 dark:text-gray-400">Earned this week</p>
                      </div>
                      <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                        12%
                        <ChevronRightSolid class="w-3 h-3 ms-1" />
                      </div>
                    </div>
                    <Chart {options} />
                    <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                      <div class="flex justify-between items-center pt-5">
                        <A href="/client/dashboard/vendor/earning" class="uppercase text-sm font-semibold hover:text-primary-700 dark:hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2 hover:no-underline">
                          Earning Report
                          <ChevronRightSolid class="w-2.5 h-2.5 ms-1.5" />
                        </A>
                      </div>
                    </div>
                  </Card>
            </div>
        </div> 
    </div>
</div>


<style>
    /* This CSS will only apply to devices with a viewport width of 1024px or more */
    @media (min-width: 1024px) {
        .desktop-content {
            display:    flex;
        }
    }

    /* This CSS will apply to devices with a viewport width less than 1024px */
    @media (max-width: 1023px) {
        .desktop-content {
            display: none;
        }
        
        .mobile-content{
            height: 100svh;
        }
    }

</style>

