<script lang='ts'>
    import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, SidebarDropdownItem, SidebarDropdownWrapper, DarkMode } from 'flowbite-svelte';
    import { ChartPieSolid, GridSolid, ShoppingCartSolid, MailBoxSolid, UserSolid, ArrowRightToBracketSolid, FileEditSolid, GearSolid } from 'flowbite-svelte-icons';
    import { MoneyBillSolid, MugSaucerSolid, RightFromBracketSolid, ScrollSolid } from 'svelte-awesome-icons';
    import { onMount } from 'svelte';
    import { supabaseClient } from '$lib/supabase';
    import { page } from '$app/stores';
    let spanClass = 'flex-1 ms-3 whitespace-nowrap';

    let user = false;
    let user_id;
    let vendordata;

    $: activeurl = $page.url.pathname;

    onMount(async () => {
        supabaseClient.auth.onAuthStateChange(async (_, session) => {
            user = !!session?.user;
            if (user) {
                const userLog = await supabaseClient.auth.getUser();
                user_id = userLog.data.user?.id;

                const { data, error } = await supabaseClient
                    .from('vendor')
                    .select('*')
                    .eq('user_id', user_id);

                if (error || data.length == 0) {
                    const { data, error } = await supabaseClient
                      .from('customer')
                      .select('*')
                      .eq('user_id', user_id);

                    if (error || data.length == 0) {
                        const { data, error } = await supabaseClient
                          .from('rider')
                          .select('*')
                          .eq('user_id', user_id);

                        if (error || data.length == 0) {
                            if (typeof window !== 'undefined') {
                                window.location.href = '/auth/login';
                            }
                        }
                        else {
                            isRider = true;
                        }
                    } else {
                        isCustomer = true;
                    }
                } else {
                    isVendor = true;
                }
            } else {
                if (typeof window !== 'undefined') {
                    window.location.href = '/auth/login';
                }
            }
        });
    });

    // @ts-ignore
    export let isCustomer = false;
    // @ts-ignore
    export let isVendor = false;
    // @ts-ignore
    export let isRider = false;

  </script>
  
<!-- CUSTOMER SIDEBAR -->
  {#if isCustomer}
  <Sidebar>
    <SidebarWrapper divClass="overflow-y-auto py-4 px-3 bg-gray-50 dark:bg-gray-800 h-[100%] ">
      <SidebarGroup>
        <SidebarItem label="Dashboard">
          <svelte:fragment slot="icon">
            <ChartPieSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarDropdownWrapper label="E-commerce">
          <svelte:fragment slot="icon">
            <ShoppingCartSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          <SidebarDropdownItem label="Products" />
          <SidebarDropdownItem label="Billing" />
          <SidebarDropdownItem label="Invoice" />
        </SidebarDropdownWrapper>
        <SidebarItem label="Kanban" {spanClass}>
          <svelte:fragment slot="icon">
            <GridSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> Pro </span>
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Inbox" {spanClass}>
          <svelte:fragment slot="icon">
            <MailBoxSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
          <svelte:fragment slot="subtext">
            <span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> 3 </span>
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Users">
          <svelte:fragment slot="icon">
            <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Sign In">
          <svelte:fragment slot="icon">
            <ArrowRightToBracketSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>
        <SidebarItem label="Sign Up">
          <svelte:fragment slot="icon">
            <FileEditSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </svelte:fragment>
        </SidebarItem>

        <DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800"/>

      </SidebarGroup>
    </SidebarWrapper>
  </Sidebar>

<!-- VENDOR SIDEBAR -->
{:else if isVendor}
<Sidebar {activeurl}>
  <SidebarWrapper divClass="overflow-y-auto py-4 px-3 dark:bg-gray-800 h-[100%] ">
    <SidebarGroup>
      <SidebarItem label="Dashboard" href="/client/dashboard/vendor" active={activeurl === '/client/dashboard/vendor'}>
        <svelte:fragment slot="icon">
          <ChartPieSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarDropdownWrapper label="Restaurant Info">
        <svelte:fragment slot="icon">
          <MugSaucerSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <SidebarDropdownItem label="Store Info" href="/client/dashboard/vendor/store" active={activeurl === '/client/dashboard/vendor/store'}/>
        <SidebarDropdownItem label="Menu" href="/client/dashboard/vendor/menu" active={activeurl === '/client/dashboard/vendor/menu'}/>
      </SidebarDropdownWrapper>
      <SidebarItem label="Orders" {spanClass}>
        <svelte:fragment slot="icon">
          <ScrollSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> Pro </span>
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Payment">
        <svelte:fragment slot="icon">
          <MoneyBillSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Users">
        <svelte:fragment slot="icon">
          <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Settings">
        <svelte:fragment slot="icon">
          <GearSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Sign Out">
        <svelte:fragment slot="icon">
          <RightFromBracketSolid  class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>

      <DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800"/>

    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>

<!-- RIDER SIDEBAR -->
{:else if isRider}
<Sidebar>
  <SidebarWrapper divClass="overflow-y-auto py-4 px-3 bg-gray-50 dark:bg-gray-800 h-[100%] ">
    <SidebarGroup>
      <SidebarItem label="Dashboard">
        <svelte:fragment slot="icon">
          <ChartPieSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarDropdownWrapper label="E-commerce">
        <svelte:fragment slot="icon">
          <ShoppingCartSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <SidebarDropdownItem label="Products" />
        <SidebarDropdownItem label="Billing" />
        <SidebarDropdownItem label="Invoice" />
      </SidebarDropdownWrapper>
      <SidebarItem label="Kanban" {spanClass}>
        <svelte:fragment slot="icon">
          <GridSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <span class="inline-flex justify-center items-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"> Pro </span>
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Inbox" {spanClass}>
        <svelte:fragment slot="icon">
          <MailBoxSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <span class="inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> 3 </span>
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Users">
        <svelte:fragment slot="icon">
          <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Sign In">
        <svelte:fragment slot="icon">
          <ArrowRightToBracketSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Sign Up">
        <svelte:fragment slot="icon">
          <FileEditSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
        </svelte:fragment>
      </SidebarItem>

      <DarkMode class="text-primary-500 dark:text-primary-600 border dark:border-gray-800"/>

    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>
{/if}
  