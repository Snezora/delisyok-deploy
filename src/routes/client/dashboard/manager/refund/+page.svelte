<script>
	import { Button } from "flowbite-svelte";
    import { goto } from '$app/navigation';
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from "svelte";

    /**
    * @type {string}
    */
    let vendorid;

    /**
	* @type {string}
	*/
    let time;

    /**
    * @type {any[] | undefined}
    */
    let pastOrders;


    onMount(async () => {
        let currentTime = new Date();
        let hours = currentTime.getHours().toString().padStart(2, '0');
        let minutes = currentTime.getMinutes().toString().padStart(2, '0');
        let seconds = currentTime.getSeconds().toString().padStart(2, '0');
        time = hours + ":" + minutes + ":" + seconds;

        // Check if the user is signed in
        const userLog = await supabaseClient.auth.getUser();

        // Fetch the vendorid from the vendor table
        const { data, error } = await supabaseClient
            .from('vendor')
            .select('vendorid');

        if (data) {
          vendorid = data[0].vendorid;
        } else {
          console.error('Error fetching business name:', error);
        }

        pastOrders = await getPastOrders();

        const channels = supabaseClient
			  .channel('custom-update-channel')
			  .on('postgres_changes', { event: '*', schema: 'public', table: 'sale', filter: `vendorid=eq.${vendorid}` }, (payload) => {
				  window.location.reload();
			  })
			  .subscribe();
    })
    
	function goTo() {
		goto('/client/dashboard/manager/');
	}

    async function getPastOrders() {
      let realData;

      const { data, error } = await supabaseClient
        .from('sale')
        .select('*, cusorder(*, customer(*))')
        .eq('vendorid', vendorid)
        .in('vendororderstatus', ['completed', 'rejected'])
        .order('receiptgenerated', { ascending: false });
        
        if (error) {
            console.error('Error fetching orders:', error);
        }
        else{
            realData = data;
        }
        return realData;
    }

    /**
	 * @param {any} saleid
	 */
    async function approverefund(saleid) {
        const { data, error } = await supabaseClient
        .from('sale')
        .update({ orderstatus: 'Refunded' })
        .eq('saleid', saleid);

        if (error) {
            console.error('Error updating order status:', error);
        } else {
          //return bubble here saying success
          location.reload();
        }
    }



</script>    

<div class="page-container min-h-[100vh] overflow-x-hidden bg-white dark:bg-stone-500">
    <div class="header h-20 bg-gray-900 px-6 flex flex-row justify-between">
        
        <div class="text-4xl mt-5 text-white w-full h-full flex items-left justify-left">
            <h1>Undelivered Order</h1>
        </div>

    </div>

    <div class = "body ml-8 mt-8 text-xl bg-grey flex flex-col items-center justify-center">
        <div class = "orderBlock">
            <div class ="ml-8 mt-1">
                <h1>Sales ID:  </h1>
                <h1>Receipt Generated:  </h1>
                <h1>Vendor Order Status</h1>
                <h1>Delivery Status:  </h1>
                <h1>Total Amount: RM</h1>
                <h1>Refund: </h1>
                <div class="yesNoButton flex">
                    <Button style ="margin-right:16px" class="w-10 h-10 mt-2 mb-2">Yes</Button>
                    <Button class="w-10 h-10 mt-2 mb-2">No</Button>
                </div>
            </div>
        </div>
    </div>
    
    <div class = "footer text-2xl ml-8 mt-8 text-white text-xl bg-grey flex-parent items-center justify-center">
        
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