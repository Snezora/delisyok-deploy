<script>
	import { Button } from "flowbite-svelte";
    import { page } from "$app/stores";

    const orderid = $page.params.orderid;
</script>

<div class="maincontainer flex w-[100%] h-[100vh]  flex-col">
    <div class="topbar flex justify-between align-middle h-[52px] bg-red-400 p-2">
        <Button color="red" on:click={() => {history.back()}}>Back</Button>
        <div class="text-2xl font-bold">Tracking Order #{orderid}</div>
        <div class="blank w-8"> </div>
    </div>
</div>