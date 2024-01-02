<script>
    import { Button, Drawer, CloseButton, ImagePlaceholder, Card, Fileupload, Input, Label, Textarea, Checkbox, Toast } from 'flowbite-svelte';
    import Sidebar from '../../../../Sidebar.svelte';
    import { sineIn } from 'svelte/easing';
    import { CompassSolid, StoreSolid } from 'svelte-awesome-icons';
    import { supabaseClient } from '$lib/supabase';
	import { onMount, tick } from 'svelte';
	import { page } from '$app/stores';
	import { ArrowRightOutline, CheckCircleSolid, EnvelopeSolid } from 'flowbite-svelte-icons';
	import SidebarVendor from '../SidebarVendor.svelte';
    import { hidden2 } from '../../../../stores/sidebar.js';
    import { vendorStore } from '../../../../stores/businessStore.js';
	import { invalidateAll } from '$app/navigation';

    let spanClass = 'flex-1 ms-3 whitespace-nowrap';
    let transitionParams = {
        x: -320,
        duration: 200,
        easing: sineIn
    };
    /**
	 * @type {any}
	 */
    let businessname;
    /**
	 * @type {any}
	 */
    let vendorData;
    /**
	 * @type {any}
	 */
    let vendorid;
    /**
	 * @type {string | undefined}
	 */
    let user_id;
    /**
	 * @type {any}
	 */
    let storephoto;
    /**
	 * @type {string}
	 */
    let storephotourl;
    let isVendor = true;
    /**
	 * @type {any}
	 */
    let vendorkkmlistingno;
	/**
	 * @type {any}
	 */
	let businessstarttime;
	/**
	 * @type {any}
	 */
	let businessclosingtime;
	/**
	 * @type {any}
	 */
	let vendoraddressl1;
	/**
	 * @type {any}
	 */
	let vendoraddressl2;
	/**
	 * @type {any}
	 */
	let vendoraddresscity;
	/**
	 * @type {any}
	 */
	let vendoraddressposcode;
    /**
	 * @type {any}
	 */
    let vendorpicname;
    /**
	 * @type {any}
	 */
    let vendoremail;
    /**
	 * @type {any}
	 */
    let vendorhp;
	/**
	 * @type {any}
	 */
	let vendoraddressstate;
    /**
	 * @type {any}
	 */
    let businessopday;
    /**
	 * @type {any[]}
	 */
    let days;
    /**
	 * @type {any}
	 */
    let storedescription;
    let openMonday = false;
    let openTuesday = false;
    let openWednesday = false;
    let openThursday = false;
    let openFriday = false;
    let openSaturday = false;
    let openSunday = false;
    /**
	 * @type {string[]}
	 */
    let selectedDays = [];

    onMount(async () => {
        invalidateAll();
        // Check if the user is signed in
        const userLog = await supabaseClient.auth.getUser();
        user_id = userLog.data.user?.id;

        const vendorData = await fetchBusinessName();
        console.log(vendorData);
        const days = JSON.parse(vendorData.businessopday);
        const openDays = {
            openMonday: days.includes('Monday'),
            openTuesday: days.includes('Tuesday'),
            openWednesday: days.includes('Wednesday'),
            openThursday: days.includes('Thursday'),
            openFriday: days.includes('Friday'),
            openSaturday: days.includes('Saturday'),
            openSunday: days.includes('Sunday'),
        };

        // Update the store
        vendorStore.set({
            ...vendorData,
            ...openDays,
        });
    
        storephotourl = await getStorePhoto();
        console.log(storephotourl);

        vendorStore.set({
            ...vendorData,
            ...openDays,
            storephotourl,
            user_id
        });

    });

    async function fetchBusinessName() {

        // Fetch the businessname from the vendor table
        const { data, error } = await supabaseClient
            .from('vendor')
            .select('*')
            .eq('user_id', user_id);

        if (error) {
            console.error('Error fetching business name:', error);
        } else if (data && data.length > 0) {
            vendorData = data[0];
        }
        return vendorData;
    }

    async function getStorePhoto() {
        const { data } = supabaseClient
        .storage
        .from('vendorstore')
        .getPublicUrl(`${storephoto}`);

        return data.publicUrl;
    }
    
    $: {
        selectedDays = [];  // Clear selectedDays

        if (openMonday) {
            selectedDays.push('Monday');
        }
        if (openTuesday) {
            selectedDays.push('Tuesday');
        }
        if (openWednesday) {
            selectedDays.push('Wednesday');
        }
        if (openThursday) {
            selectedDays.push('Thursday');
        }
        if (openFriday) {
            selectedDays.push('Friday');
        }
        if (openSaturday) {
            selectedDays.push('Saturday');
        }
        if (openSunday) {
            selectedDays.push('Sunday');
        }
    }


    async function saveNewInfo() {

        // // Fetch the businessname from the vendor table
        // const { data, error } = await supabaseClient
        //     .from('vendor')
        //     .select('*')
        //     .eq('user_id', user_id);

        console.log("here");

        // if (error) {
        //     alert('Error fetching business name');
        // } else if (data && data.length > 0) {
            // selectedDays = [];
            // if (openMonday) {
            //     selectedDays.push('Monday');
            // } 
            // if (openTuesday) {
            //     selectedDays.push('Tuesday');
            // } 
            // if (openWednesday) {
            //     selectedDays.push('Wednesday');
            // } 
            // if (openThursday) {
            //     selectedDays.push('Thursday');
            // } 
            // if (openFriday) {
            //     selectedDays.push('Friday');
            // } 
            // if (openSaturday) {
            //     selectedDays.push('Saturday');
            // } 
            // if (openSunday) {
            //     selectedDays.push('Sunday');
            // } 

            await tick();

            const newbusinessopday = JSON.stringify(selectedDays);
            console.log(user_id);

            const { error: vendorError } = await supabaseClient
			.from('vendor')
			.update([
				{
					vendoremail,
					vendorpicname,
					vendorhp,
                    storedescription,
					vendoraddressl1,
					vendoraddressl2,
					vendoraddresscity,
					vendoraddressposcode,
					vendoraddressstate,
					businessname,
					businessstarttime,
					vendorkkmlistingno,
					businessclosingtime,
                    businessopday: newbusinessopday,
				},
			])
            .eq('user_id', user_id);

            if (vendorError) {
                alert('Error updating vendor data');
                console.error(vendorError);
            } else {
                alert('Vendor data updated successfully');
                invalidateAll();
            }
        }


    let photourl;

    async function changePhoto(){
        const file = storephoto[0];
		const fileExt = file.name.split('.').pop();
		const filePath = `${Math.random()}.${fileExt}`;
		photourl = filePath;
		console.log(storephoto);
		console.log(photourl);
		const { error: imageerror } = await supabaseClient.storage.from('vendorstore').upload(filePath, file);
		if (imageerror) throw imageerror;

        const { data, error } = await supabaseClient
        .from('vendor')
        .update({ storephoto: photourl })
        .eq('vendorid', vendorid)
        .select()

        if (error) {
            console.error('Error updating store photo:', error);
        }
        else{
            console.log('Store photo updated successfully:', data);
            alert('Store photo updated successfully');
            window.location.href = '/client/dashboard/vendor/';
        }
    }

    vendorStore.subscribe(value => {
        vendorid = value.vendorid;
        businessname = value.businessname;
        storephoto = value.storephoto;
        businessopday = value.businessopday;
        businessstarttime = value.businessstarttime;
        businessclosingtime = value.businessclosingtime;
        storedescription = value.storedescription;
        vendoremail = value.vendoremail;
        vendorhp = value.vendorhp;
        vendorpicname = value.vendorpicname;
        vendoraddressl1 = value.vendoraddressl1;
        vendoraddressl2 = value.vendoraddressl2;
        vendoraddresscity = value.vendoraddresscity;
        vendoraddressposcode = value.vendoraddressposcode;
        vendoraddressstate = value.vendoraddressstate;
        vendorkkmlistingno = value.vendorkkmlistingno;
        openMonday = value.businessopday.includes('Monday');
        openTuesday = value.businessopday.includes('Tuesday');
        openWednesday = value.businessopday.includes('Wednesday');
        openThursday = value.businessopday.includes('Thursday');
        openFriday = value.businessopday.includes('Friday');
        openSaturday = value.businessopday.includes('Saturday');
        openSunday = value.businessopday.includes('Sunday');
        storephotourl = value.storephotourl;
        user_id = value.user_id;
    }) //CONTINUE HERE

    $: activeurl = $page.url.pathname;
</script>


<div class="pagecontainer h-[100%] w-[100%] flex flex-row mobile-content">
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
        
    <form class="w-[100%] bg-slate-300 dark:bg-pdark-100 overflow-x-hidden flex flex-col">
        <div class="storephoto w-[100%] flex-wrap flex items-center justify-around bg-gray-200 dark:bg-orange-900 p-5">
            <div class="flex justify-center ">            
            {#if storephoto}
            <div class="w-[420px] h-[225px] flex justify-center align-middle">
                <img src={storephotourl} alt="storephoto" class="h-[100%]" />
            </div>
            {:else}
                <img src="https://placehold.co/450x225" alt="storephoto" class="w-[450px]" />
            {/if}
            </div>
            <div class="flex justify-center flex-col items-center gap-5">
                <div class="intro font-extrabold text-[32px] dark:text-white text-center">Store Front Information for {businessname}</div>
                <div class="fileuploadingarea">
                    <span class="dark:text-white">Upload your store front image here:</span>
                    <Fileupload accept=".png, .jpg, .jpeg" bind:files={storephoto} color="white" class="border-none m-[1px] bg-white dark:bg-gray-500 dark:text-white" ></Fileupload>
                </div>
                <Button on:click={changePhoto}>Submit Photo</Button>
            </div>
        </div>
        <div class="bottomhalf p-7 grid lg:grid-cols-3 gap-9 justify-around md:grid-flow-row">
            <div class="firsthalf flex flex-col gap-4">
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Store ID</Label>
                    <Input id="vendorid" type="text" placeholder="02438992" readonly disabled bind:value={vendorid}>
                      <StoreSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-[1.8rem]">
                    <Label for="input-group-1" class="block mb-2">Business Name</Label>
                    <Input id="businessname" type="text" placeholder="Delisyok Sdn Bhd" bind:value={businessname}>
                      <StoreSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Description</Label>
                    <Textarea id="message" rows="6" bind:value={storedescription} placeholder="Description for your store (What you sell, how you do it, etc.)"></Textarea>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Vendor KKM Listing No.</Label>
                    <Input id="kkmlistingno" type="text" placeholder="KKM Listing No" bind:value={vendorkkmlistingno}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
            </div>
            <div class="secondhalf flex flex-col gap-4">
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Your Email</Label>
                    <Input id="email" type="email" placeholder="madani@delisyok.com" bind:value={vendoremail}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Business PIC Name</Label>
                    <Input id="email" type="text" placeholder="PIC Name" bind:value={vendorpicname}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Business Handphone No.</Label>
                    <Input id="email" type="email" placeholder="madani@delisyok.com" bind:value={vendorhp}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label>
                        <span class=" dark:text-white block mb-2">Business Opening Time</span>
                        <Input
                            type="time"
                            step="600"
                            name="businessOpeningTime"
                            required
                            bind:value={businessstarttime}
                            class=" text-black dark:bg-gray-700"
                        >
                        </Input>
                    </Label>
                </div>
                <div class="mb-6">
                    <Label>
                        <span class=" dark:text-white block mb-2">Business Closing Time</span>
                        <Input
                            type="time"
                            step="600"
                            name="businessClosingTime"
                            required
                            bind:value={businessclosingtime}
                            class=" text-black dark:bg-gray-700"
                        >
                        </Input>
                    </Label>
                </div>
            </div>
            <div class="thirdhalf flex flex-col gap-4">
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Vendor Address Line 1</Label>
                    <Input id="vendoraddressl1" type="text" placeholder="Address Line 1" bind:value={vendoraddressl1}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Vendor Address Line 2</Label>
                    <Input id="vendoraddressl2" type="text" placeholder="Address Line 2" bind:value={vendoraddressl2}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Vendor City</Label>
                    <Input id="vendoraddresscity" type="text" placeholder="City" bind:value={vendoraddresscity}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-8">
                    <Label for="input-group-1" class="block mb-2">Vendor Post Code</Label>
                    <Input id="vendoraddressposcode" type="text" placeholder="Postcode" bind:value={vendoraddressposcode}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
                <div class="mb-6">
                    <Label for="input-group-1" class="block mb-2">Vendor State</Label>
                    <Input id="vendoraddressstate" type="text" placeholder="State" bind:value={vendoraddressstate}>
                      <EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </div>
            </div>
        </div>
        <div class="dayscontainer flex flex-col items-center mb-10">
            <Label for="opendays" class="block mb-2">Vendor Open Days</Label>
            <div class="opendays p-4 rounded-2xl flex flex-wrap gap-5 mx-5 bg-white dark:bg-gray-700">
                <Checkbox id="openMonday" bind:checked={openMonday}>Monday</Checkbox>
                <Checkbox id="openTuesday" bind:checked={openTuesday}>Tuesday</Checkbox>
                <Checkbox id="openWednesday" bind:checked={openWednesday}>Wednesday</Checkbox>
                <Checkbox id="openThursday" bind:checked={openThursday}>Thursday</Checkbox>
                <Checkbox id="openFriday" bind:checked={openFriday}>Friday</Checkbox>
                <Checkbox id="openSaturday" bind:checked={openSaturday}>Saturday</Checkbox>
                <Checkbox id="openSunday" bind:checked={openSunday}>Sunday</Checkbox>
            </div>
        </div>
        <div class="savebutton flex justify-center mb-10">
            <Button class="" on:click={saveNewInfo} href="/client/dashboard/vendor/store">Save Information</Button>
        </div>
    </form>
</div>
