<script>
	import { supabaseClient } from "$lib/supabase";
	import { Drawer, CloseButton, Input, Button } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { hidden2 } from "../../../../stores/sidebar";
	import SidebarRider from "../SidebarRider.svelte";
    import Sidebar from "../../../../Sidebar.svelte";
	import { sineIn } from "svelte/easing";


    let isRider = true;
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    /**
	 * @type {string | undefined}
	 */
    let user_id;
    /**
	 * @type {never[]}
	 */
    let riderData = [];

    onMount(async () => {
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

        riderData = await fetchRiderInfo();
    });

async function fetchRiderInfo(){
    let riderData;
    // Fetch the rider from the deliveryrider table
    const { data, error } = await supabaseClient
        .from('deliveryrider')
        .select('*')
        .eq('user_id', user_id);

        if (error) {
        console.error('Error fetching rider info:', error);
        } else if (data && data.length > 0) {
            riderData = data[0];
        }
        return riderData;
}

async function updateRiderInfo(){
    const { error } = await supabaseClient
    .from('deliveryrider')
    .update({
        ridername: riderData.ridername,
        rideremail: riderData.rideremail,
        riderhp: riderData.riderhp,
        rideric: riderData.rideric,
        riderlicense: riderData.riderlicense,
        rideraddressl1: riderData.rideraddressl1,
        rideraddressl2: riderData.rideraddressl2,
        rideraddresscity: riderData.rideraddresscity,
        rideraddressstate: riderData.rideraddressstate,
        rideraddressposcode: riderData.rideraddressposcode,
        riderdob: riderData.riderdob,
        licenseexpirydate: riderData.licenseexpirydate
    })
    .eq('user_id', user_id);

    if (error) {
        console.error('Error updating rider info:', error);
    } else {
        console.log('Rider info updated successfully!');
        alert('Rider info updated successfully!');
        window.location.reload();
    }
}


</script>

<div class="pagecontainer w-[100%] max-w-[100%] flex flex-row mobile-content min-h-[100lvh] bg-white dark:bg-gray-600">
    <SidebarRider />
    <div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937] ">
        <Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
            <div class="flex items-center">
              <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase rounded">Navigation</h5>
              <CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
            </div>
        <Sidebar {isRider} />
        </Drawer>
    </div>
    <div class="maincontainer flex flex-col w-[100%] gap-5">
        <div class="headers">
            <div class="realheader bg-black text-white font-bold h-[50px] w-[100%] flex ">
                <div class="lg:text-[24px] md:text-[16px] ml-auto mr-auto self-center">DELISYOK DELIVERY RIDER CLIENT</div>
            </div>
            <div class="realheader bg-orange-600 text-white font-bold h-[50px] w-[100%] flex ">
                <div class="lg:text-[24px] md:text-[16px] ml-auto mr-auto self-center">EDIT RIDER INFORMATION</div>
            </div>
        </div>
        <form class="w-[100%] flex flex-wrap md:gap-[5rem] lg:gap-[5rem] gap-5 p-5 justify-center">
            <div class="firstpart flex flex-col gap-5 min-w-[40%]">
                <div class="name">
                    <span class="dark:text-white font-bold">Name</span>
                    <Input bind:value={riderData.ridername} type="text" id="name" placeholder="Name" />
                </div>
                <div class="email">
                    <span class="dark:text-white font-bold">Email</span>
                    <Input bind:value={riderData.rideremail} type="email" id="email" placeholder="Email" />
                </div>
                <div class="hp">
                    <span class="dark:text-white font-bold">Handphone Number</span>
                    <Input bind:value={riderData.riderhp} type="text" id="hp" placeholder="Handphone" />
                </div>
                <div class="ic">
                    <span class="dark:text-white font-bold">IC Number</span>
                    <Input bind:value={riderData.rideric} type="text" id="ic" placeholder="IC" />
                </div>
                <div class="license">
                    <span class="dark:text-white font-bold">Driving License Number</span>
                    <Input bind:value={riderData.riderlicense} type="text" id="license" placeholder="License" />
                </div>
                <div class="expirydate">
                    <span class="dark:text-white font-bold">Driving License Expiry Date</span>
                    <Input bind:value={riderData.licenseexpirydate} type="date" id="expirydate" placeholder="Expiry Date" />
                </div>
            </div>
            <div class="secondpart flex flex-col gap-5 min-w-[40%]">
                <div class="dob">
                    <span class="dark:text-white font-bold">Date of Birth</span>
                    <Input bind:value={riderData.riderdob} type="date" id="dob" placeholder="Date of Birth" />
                </div>
                <div class="addressl1">
                    <span class="dark:text-white font-bold"> Address Line 1</span>
                    <Input bind:value={riderData.rideraddressl1} type="text" id="addressl1" placeholder="Address Line 1" />
                </div>
                <div class="addressl2">
                    <span class="dark:text-white font-bold"> Address Line 2</span>
                    <Input bind:value={riderData.rideraddressl2} type="text" id="addressl2" placeholder="Address Line 2" />
                </div>
                <div class="addresscity">
                    <span class="dark:text-white font-bold">Address City</span>
                    <Input bind:value={riderData.rideraddresscity} type="text" id="addresscity" placeholder="City" />
                </div>
                <div class="addressposcode">
                    <span class="dark:text-white font-bold">Address Postal Code</span>
                    <Input bind:value={riderData.rideraddressposcode} type="text" id="addressposcode" placeholder="Postal Code" />
                </div>
                <div class="addressstate">
                    <span class="dark:text-white font-bold">Address State</span>
                    <Input bind:value={riderData.rideraddressstate} type="text" id="addressstate" placeholder="State" />
                </div>
            </div>
        </form>
        <Button class="self-center mb-10" on:click={updateRiderInfo}>Save Information</Button>
    </div>
</div>