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

    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };

    /**
	 * @type {string}
	 */
    let time;
    let showLoading = true;

    onMount(() => {
        let currentTime = new Date();
        time = currentTime.getHours() + ":" + currentTime.getMinutes() + ":" + currentTime.getSeconds();
    })
</script>

{#if showLoading}
<div class=" flex toastcontainer justify-center align-middle pt-5 fade-in h-[100%] w-[100%] items-center">
    <Spinner size="8" class="text-center"/>
</div>
{/if}

<div class="pagecontainer h-[100%] w-[100%] flex flex-row mobile-content bg-gray-500">
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
    <div class="maincontainer flex flex-col w-[100%]">
        <div class="title flex justify-center items-center text-2xl font-bold bg-orange-900 text-white h-[50px]">Orders</div>
        {time}
    </div>
</div>

<style>
    .toastcontainer {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10000;
    }
  
      .fade-in {
          transition: opacity 0.5s ease-in;
          opacity: 1;
      }
</style>