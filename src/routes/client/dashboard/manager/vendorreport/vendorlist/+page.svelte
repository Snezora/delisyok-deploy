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
  let searchQuery = "";

  function goTo() {
  goto('/client/dashboard/manager/vendorreport/report');
}

   
</script>

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
  <div class="header h-20 bg-gray-900 px-6 flex flex-row justify-between"></div>

  <main>
    <h1>Welcome to the Vendor Sales Report Page</h1>
    <p>Search for vendors:</p>
    <input type="text" bind:value={searchQuery} placeholder="Vendor Name/Vendor ID" />
    <button on:click={goTo}>Search</button>
  </main>
</div>

<style>

  main {
    text-align: center;
    font-family: 'Inria Sans', sans-serif;
    padding: 20px;
  }

  h1 {
    font-size: 24px;
    font-family: 'Inria Sans', sans-serif;
    margin-bottom: 10px;
  }

  p {
    font-size: 20px;
    font-family: 'Inria Sans', sans-serif;
    margin-bottom: 5px;
  }

  input {
    padding: 5px;
    font-family: 'Inria Sans', sans-serif;
    margin-bottom: 30px;
  }

  button {
    padding: 5px 10px;
    background-color: #EF562F;
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
  }

</style>
