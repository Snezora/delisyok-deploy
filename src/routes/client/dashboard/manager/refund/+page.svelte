<script>
	import { Button } from "flowbite-svelte";
    import { goto } from '$app/navigation';

	function goTo() {
		goto('/client/dashboard/manager/');
	}


</script>    

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-20 bg-gray-900 px-6 flex flex-row justify-between">
        
        <div class="text-4xl mt-5 text-white w-full h-full flex items-left justify-left">
            <h1>Undelivered Order</h1>
        </div>

    </div>

    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-left justify-left">
        <div class = "orderBlock">
            <div class ="ml-8 mt-6">
                <h1>Order 1 </h1>
                    <div class = "yesNoButton">
                        <Button>Yes</Button>
                    </div>
                    <div class = "yesNoButton">
                        <Button>No</Button>
                    </div>
            </div>


        </div>
    </div>
    
    <div class = "footer text-2xl ml-8 mt-8 text-white text-xl bg-grey flex-parent items-left justify-left">
        
        <div class="text-white text-2xl flex flex-1">
            <div class="returnPosition">
                <Button type="button" class="w-[325px] mt-4" on:click={goTo} id="returnbutton">Return</Button>
            </div>
        </div>
        
    </div>

</div>

<style>

    .returnPosition {
    flex: 1;
    border: 2px solid;
    margin: 10px;
    }
    .orderBlock {
    width: 1200px;
    height: 200px;
    top: 616px;

    background: #D9D9D9;
    border-radius: 20px;
    }

    .yesButton {
    margin: 0;
    position: absolute;
    top: 50%;
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
    }

</style>