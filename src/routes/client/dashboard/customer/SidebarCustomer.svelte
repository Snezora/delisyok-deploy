<script>
    import { Sidebar, SidebarWrapper, SidebarBrand, SidebarItem, SidebarGroup, DarkMode } from 'flowbite-svelte';
    import { UserGroupSolid, MobilePhoneSolid, UserSettingsSolid, UserSolid, QuestionCircleSolid, BookSolid } from 'flowbite-svelte-icons';
    import "./Sidebar.css";
	import { ArrowRightFromBracketSolid } from 'svelte-awesome-icons';
    let spanClass = 'flex-1 ms-0 whitespace-nowrap ';
  </script>

<Sidebar id="customerSidebar" class="sidebar">
    <SidebarWrapper class="h-[100%]">
       <SidebarGroup  class={spanClass}>
         <SidebarItem label="  About us" iconClass="icon-container">
           <svelte:fragment slot="icon">
             <UserGroupSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
           </svelte:fragment>
         </SidebarItem>
         <SidebarItem label="  Order history" href="/client/dashboard/customer/orderhistory">
           <svelte:fragment slot="icon">
             <BookSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
           </svelte:fragment>
         </SidebarItem>
         <SidebarItem label="  Contact us">
          <svelte:fragment slot="icon">
            <MobilePhoneSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
          </svelte:fragment>
        </SidebarItem>
         <SidebarItem label="  FAQ">
            <svelte:fragment slot="icon">
              <QuestionCircleSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
            </svelte:fragment>
          </SidebarItem>
         <SidebarItem label="  Settings">
           <svelte:fragment slot="icon">
             <UserSettingsSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
           </svelte:fragment>
         </SidebarItem>
         <SidebarItem label="Account" class="mb-64">
           <svelte:fragment slot="icon">
             <UserSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
           </svelte:fragment>
         </SidebarItem>
         <DarkMode class=" -translate-x-1"/>
         <SidebarItem label="Sign Out">
            <svelte:fragment slot="icon">
              <ArrowRightFromBracketSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white icon-container" />
            </svelte:fragment>
          </SidebarItem>
       </SidebarGroup>
    </SidebarWrapper>
   </Sidebar>