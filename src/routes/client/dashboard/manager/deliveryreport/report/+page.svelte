<script>
    
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
	import { ArrowLeftOutline } from "flowbite-svelte-icons";
    import { Drawer, CloseButton, Accordion, AccordionItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Button } from "flowbite-svelte";
	import { hidden2 } from "../../../../../stores/sidebar";
	import Sidebar from "../../../../../Sidebar.svelte";
	import { sineIn } from "svelte/easing";
	import SpinnerSet from "../../../../SpinnerSet.svelte";

    import { goto } from '$app/navigation';

	function goTo() {
		goto('/client/dashboard/manager');
	}

     
</script>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-20 bg-gray-900 px-6 flex flex-row justify-between">
        
        <div class="text-4xl mt-5 text-white w-full h-full flex items-left justify-left">
            <h1>Delivery Rider Report</h1>
        </div>

        <div class="text-2xl mt-6 text-white w-full h-full flex justify-items-start">
            <h1>Delivery Rider ID :</h1>
        </div>
    </div>

    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-center justify-center">
        <div class = "orderBlock">
            <div class ="ml-8 mt-1">
                <h1>Sales ID:</h1>
                <h1>Receipt Generated:</h1>
                <h1>Delivery Status: </h1>
                <h1>Commission: RM </h1>
            </div>
        </div>
            
    </div>

    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-center justify-center">
        <div class = "orderBlock">
            <div class ="ml-8 mt-1">
                <h1>Sales ID:</h1>
                <h1>Receipt Generated:</h1>
                <h1>Delivery Status: </h1>
                <h1>Commission: RM </h1>
            </div>
        </div>
            
    </div>

    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-center justify-center">
        <div class = "orderBlock">
            <div class ="ml-8 mt-1">
                <h1>Sales ID:</h1>
                <h1>Receipt Generated:</h1>
                <h1>Delivery Status: </h1>
                <h1>Commission: RM </h1>
            </div>
        </div>
            
    </div>

    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-center justify-center">
        <div class = "orderBlock">
            <div class ="ml-8 mt-1">
                <h1>Sales ID:</h1>
                <h1>Receipt Generated:</h1>
                <h1>Delivery Status: </h1>
                <h1>Commission: RM </h1>
            </div>
        </div>
            
    </div>
    
    <div class = "footer text-2xl ml-8 mt-8 text-white text-xl bg-grey flex-parent items-center justify-center">
        <div class ="totalCommision">
            <div class ="ml-8 mt-6">
                <h1>Total Commision (RM) : </h1>
            </div>
        </div>

        <div class="text-white text-2xl flex flex-1">
            <div class="returnPosition">
                <Button type="button" class="w-[325px] mt-4" on:click={goTo} id="returnbutton">Return</Button>
            </div>
        </div>
    </div>

</div>   

<style>
	.totalCommision {
    display: flex;
    box-sizing: border-box;
    width: 95%;
    height: 80px;

    background: #111827;
    border: 1px solid #000000;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 10px;
	}

    .returnPosition {
    flex: 1;
    border: 2px solid;
    margin: 10px;
    }

    .orderBlock {
            width: 80%;
            height: 20%;
            top: 616px;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: #D9D9D9;
            border-radius: 20px;
            overflow: auto;
        }

</style>


