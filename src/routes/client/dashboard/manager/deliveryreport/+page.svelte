<script>
    
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
	import { ArrowLeftOutline } from "flowbite-svelte-icons";
    import { Drawer, CloseButton, Accordion, AccordionItem, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";
	import { hidden2 } from "../../../../stores/sidebar";
	import Sidebar from "../../../../Sidebar.svelte";
	import { sineIn } from "svelte/easing";
	import SpinnerSet from "../../../SpinnerSet.svelte";

     
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


    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-left justify-left">
        <h1>Deliver Order 1</h1>
    </div>   

</div>   



