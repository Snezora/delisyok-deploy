<script>
	// @ts-nocheck

	import {
		Drawer,
		CloseButton,
		Button,
		Label,
		Input,
		Textarea,
		Toggle,
		Toast,
		Fileupload
	} from 'flowbite-svelte';
	import { hidden2 } from '../../../../../../stores/sidebar';
	import Sidebar from '../../../../../../Sidebar.svelte';
	import SidebarVendor from '../../../SidebarVendor.svelte';
	import { sineIn } from 'svelte/easing';
	import { page } from '$app/stores';
	// @ts-ignore
	import {
		ArrowLeftSolid,
		BowlFoodSolid,
		DollarSignSolid,
		EnvelopeSolid,
		MSolid,
		RSolid
	} from 'svelte-awesome-icons';
	import { CheckCircleSolid } from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import { supabaseClient } from '$lib/supabase';
	import SpinnerSet from '../../../../../SpinnerSet.svelte';
	import { uploadingFile } from '../../../../../../stores/businessStore';

	const itemid = $page.params.fooditem;

	let isVendor = true;
	let showToast = false;
	let user_id;
	/**
	 * @type {any}
	 */
	let vendorid;
	/**
	 * @type {any[]}
	 */
	let menuitem = [];
	let transitionParams = {
		x: -320,
		duration: 200,
		easing: sineIn
	};
	/**
	 * @type {string}
	 */
	let menuitemphotourl;
	/**
	 * @type {any}
	 */
	let menuItemPhoto;

	onMount(async () => {
		$uploadingFile = false;
		const userLog = await supabaseClient.auth.getUser();
		user_id = userLog.data.user?.id;
		const { data, error } = await supabaseClient.from('vendor').select('*').eq('user_id', user_id);

		if (error) {
			console.error('Error fetching business name:', error);
		} else if (data && data.length > 0) {
			vendorid = data[0].vendorid;
		}
		menuitem = await fetchMenuItem();
		console.log(menuitem);
		menuitemphotourl = await getItemPhoto();
		console.log(menuitemphotourl);
	});

	async function fetchMenuItem() {
		const { data, error } = await supabaseClient.from('menuitem').select('*').eq('itemid', itemid);

		if (error) {
			console.error('Error fetching menu item:', error);
		} else {
			if (data[0].vendorid === vendorid) {
				return data[0];
			} else {
				window.location.href = '/client/dashboard/vendor/menu';
			}
		}
	}

	async function saveNewItemInfo() {
		const { error: menuItemError } = await supabaseClient
			.from('menuitem')
			.update([
				{
					// @ts-ignore
					itemname: menuitem.itemname,
					// @ts-ignore
					itemdescription: menuitem.itemdescription,
					// @ts-ignore
					itemprice: menuitem.itemprice,
					// @ts-ignore
					isActive: menuitem.isActive
				}
			])
			.eq('itemid', itemid)
			.eq('vendorid', vendorid);

		if (menuItemError) {
			alert('Error updating vendor data');
			console.error(menuItemError);
		} else {
			showToast = true;
			window.location.href = `/client/dashboard/vendor/menu/${itemid}/edit`;
		}
	}

	async function getItemPhoto() {
		const { data } = supabaseClient.storage
			.from('menuitemimage')
			// @ts-ignore
			.getPublicUrl(`${menuitem.itemimage}`);

		return data.publicUrl;
	}

	async function changePhoto() {
		if (menuItemPhoto) {
			const file = menuItemPhoto[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `${Math.random()}.${fileExt}`;
			const { error: imageerror } = await supabaseClient.storage
				.from('menuitemimage')
				.upload(filePath, file);
			if (imageerror) throw imageerror;

			const { data, error } = await supabaseClient
				.from('menuitem')
				.update({ itemimage: filePath })
				.eq('itemid', itemid)
				.select();

			if (error) {
				console.error('Error updating store photo:', error);
			} else {
				console.log('Menu Item photo updated successfully:', data);
				alert('Menu Item photo updated successfully');
				window.location.href = `/client/dashboard/vendor/menu/${itemid}/edit`;
			}
		} else {
			alert('Please upload a photo');
		}
	}

	function cancel() {
		window.location.href = `/client/dashboard/vendor/menu`;
	}
</script>

<SpinnerSet />

{#if showToast}
	<div class=" flex toastcontainer justify-center pt-5 fade-in">
		<Toast color="green">
			<svelte:fragment slot="icon">
				<CheckCircleSolid class="w-5 h-5" />
				<span class="sr-only">Check icon</span>
			</svelte:fragment>
			Item edited successfully.
		</Toast>
	</div>
{/if}

<div
	class="pagecontainer h-[100%] min-h-[100dvh] w-[100%] flex flex-row mobile-content bg-gray-500 dark:bg-gray-500"
>
	<SidebarVendor />
	<div class="sidebarcontainer max-w-[] bg-white dark:bg-[#1F2937]">
		<Drawer transitionType="fly" {transitionParams} bind:hidden={$hidden2} id="sidebar2" class="">
			<div class="flex items-center">
				<h5
					id="drawer-navigation-label-3"
					class="text-base font-semibold text-gray-500 uppercase rounded"
				>
					Navigation
				</h5>
				<CloseButton on:click={() => ($hidden2 = true)} class="mb-4 dark:text-white" />
			</div>
			<Sidebar {isVendor} />
		</Drawer>
	</div>
	<div class="mainpagecontainer flex flex-col w-[100%]">
		<div
			class="title flex justify-between items-center text-2xl font-bold bg-orange-900 text-white h-[50px] p-3"
		>
			<Button class=" justify-center h-9 w-12 p-0" href="/client/dashboard/vendor/menu">
				<ArrowLeftSolid size="25" />
			</Button>
			Edit Item
			<p />
		</div>
		<div class="maincontainer w-[100%] grid grid-flow-row md:grid-flow-col bg-gray-100 h-[100%]">
			<div class="firsthalf justify-start py-10 flex flex-col px-20 pb-0">
				<!-- Put Photo here -->
				<img src={menuitemphotourl} alt="" class="w-[300px] self-center" />
				<div class="flex justify-center flex-col items-center gap-5 py-7">
					<div class="fileuploadingarea">
						<span class="dark:text-white font-bold">Upload your food image here:</span>
						<Fileupload
							accept=".png, .jpg, .jpeg"
							bind:files={menuItemPhoto}
							on:click={() => {
								uploadingFile.set(true);
							}}
							on:change={() => {
								uploadingFile.set(true);
							}}
							color="white"
							class="border m-[1px] bg-white dark:bg-gray-500 dark:text-white"
						></Fileupload>
					</div>
					<Button on:click={changePhoto}>Submit Photo</Button>
				</div>
			</div>
			<div class="secondhalf justify-end py-10 px-10 lg:pr-[250px]">
				<!-- Put Information here -->
				<form action="">
					<div class="mb-6">
						<Label
							for="itemname"
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Name</Label
						>
						<Input
							id="itemname"
							required
							type="text"
							placeholder="Egg Rolls"
							bind:value={menuitem.itemname}
						>
							<BowlFoodSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
						</Input>
					</div>
					<div class="mb-6">
						<Label
							for="message"
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>Item Description</Label
						>
						<Textarea
							id="message"
							required
							rows="6"
							placeholder="Describe what your food item is"
							bind:value={menuitem.itemdescription}
							maxlength="255"
						></Textarea>
						{#if menuitem.itemdescription && menuitem.itemdescription.length}
							<p class="text-right">{menuitem.itemdescription.length} / 255</p>
						{:else}
							<p class="text-right">0 / 255</p>
						{/if}
					</div>
					<div class="mb-10">
						<Label
							for="itemprice"
							class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Item Price</Label
						>
						<Input
							id="itemprice"
							type="text"
							placeholder="69.99"
							bind:value={menuitem.itemprice}
							required
						>
							<DollarSignSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
						</Input>
					</div>
					<div class="mb-6 grid grid-flow-col items-end">
						<div class="toggleselection">
							<Label
								for="itemprice"
								class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>Show on Menu</Label
							>
							<Toggle bind:checked={menuitem.isActive}></Toggle>
						</div>
						<div class="buttonscontainer justify-end flex gap-3">
							<Button on:click={saveNewItemInfo}>Submit</Button>
							<Button color="yellow" on:click={cancel}>Cancel</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
