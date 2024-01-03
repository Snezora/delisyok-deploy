<script>
	import { Spinner } from "flowbite-svelte";
	import { fade } from "svelte/transition";

        let showLoading = true;
        setTimeout(() => {
        showLoading = false;
    }, 1000);
</script>

{#if showLoading}
    <div class=" flex toastcontainer justify-center align-middle pt-5 fade-in h-[100%] w-[100%] items-center bg-gray-500" transition:fade={{duration: 1000}}>   
    <Spinner size="8" class="text-center"/>
    </div>
{/if}

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