<script>
	// @ts-nocheck

	import { Label, Input, Button, Checkbox, Popover, Select, Toggle } from 'flowbite-svelte';

	import {
		PhoneSolid,
		UserSolid,
		EnvelopeSolid,
		LockSolid,
		HomeSolid,
		CheckOutline,
		CloseOutline,
		BuildingSolid
	} from 'flowbite-svelte-icons';
	import {
		BuildingColumnsSolid,
		CakeCandlesSolid,
		DoorClosedSolid,
		DoorOpenSolid,
		SignHangingSolid
	} from 'svelte-awesome-icons';
	import { supabaseClient } from '$lib/supabase';
	import { goto } from '$app/navigation';

	let selectedStates;
	let states = [
		{ value: 'Johor', name: 'Johor' },
		{ value: 'Kedah', name: 'Kedah' },
		{ value: 'Kelantan', name: 'Kelantan' },
		{ value: 'Melaka', name: 'Melaka' },
		{ value: 'Negeri Sembilan', name: 'Negeri Sembilan' },
		{ value: 'Pahang', name: 'Pahang' },
		{ value: 'Perak', name: 'Perak' },
		{ value: 'Perlis', name: 'Perlis' },
		{ value: 'Pulau Pinang', name: 'Pulau Pinang' },
		{ value: 'Sabah', name: 'Sabah' },
		{ value: 'Sarawak', name: 'Sarawak' },
		{ value: 'Selangor', name: 'Selangor' },
		{ value: 'Terengganu', name: 'Terengganu' },
		{ value: 'W.P. Kuala Lumpur', name: 'W.P. Kuala Lumpur' },
		{ value: 'W.P. Labuan', name: 'W.P. Labuan' },
		{ value: 'W.P. Putrajaya', name: 'W.P. Putrajaya' }
	];

	let mondayToggle;
	let tuesdayToggle;
	let wednesdayToggle;
	let thursdayToggle;
	let fridayToggle;
	let saturdayToggle;
	let sundayToggle;

	let loading = false;
	/**
	 * @type {any}
	 */
	let email;
	/**
	 * @type {any}
	 */
	let password;
	let vendorpicname;
	let vendorhp;
	let businessname;
	let vendorkkmlistingno;
	let businessstarttime;
	let businessclosingtime;
	let vendoraddressl1;
	let vendoraddressl2;
	let vendoraddresscity;
	let vendoraddressposcode;
	let vendoraddressstate;
	let businessopday = [];

	function createDaysArray() {
		if (mondayToggle) {
			businessopday.push('Monday');
		}
		if (tuesdayToggle) {
			businessopday.push('Tuesday');
		}
		if (wednesdayToggle) {
			businessopday.push('Wednesday');
		}
		if (thursdayToggle) {
			businessopday.push('Thursday');
		}
		if (fridayToggle) {
			businessopday.push('Friday');
		}
		if (saturdayToggle) {
			businessopday.push('Saturday');
		}
		if (sundayToggle) {
			businessopday.push('Sunday');
		}

		return businessopday;
	}

	let passwordconfirm;

	const handleSignup = async () => {
		if (
			password == passwordconfirm &&
			isValidName() &&
			isValidTime() &&
			isValidRegNo() &&
			validatePhoneNumber() &&
			validateaddress() &&
			validatePoscode() &&
			validateState()
		) {
			try {
				loading = true;
				console.log(email);

				const { error } = await supabaseClient.auth.signUp({
					email,
					password
				});

				if (error) throw error;

				const { error: SigninError } = await supabaseClient.auth.signInWithPassword({
					email,
					password
				});

				if (SigninError) throw SigninError;

				const user = await supabaseClient.auth.getUser();
				const user_id = user.data.user.id;

				createDaysArray();
				const { error: vendorError } = await supabaseClient
					.from('vendor')
					.insert([
						{
							user_id,
							vendoremail: email,
							vendorpicname,
							vendorhp,
							vendoraddressl1,
							vendoraddressl2,
							vendoraddresscity,
							vendoraddressposcode,
							vendoraddressstate,
							businessname,
							businessstarttime,
							vendorkkmlistingno,
							businessclosingtime,
							businessopday
						}
					])
					.select();

				if (vendorError) {
					console.log(vendorError);
					throw vendorError;
				}
				alert('Sign up successful!');
				if (typeof window !== 'undefined') {
					window.location.href = '/auth/login';
				}
			} catch (error) {
				console.error(error);
				alert(error);
			} finally {
				loading = false;
			}
		}
	};

	function isValidName() {
		if (!vendorpicname || vendorpicname.length < 3) {
			alert(
				'Please enter a valid name which only consist of alphabets and space. The name must be at least 3 letters.'
			);
			return false;
		}

		const isValidName = /^[a-zA-Z ]+$/.test(vendorpicname);
		if (!isValidName) {
			alert(
				'Please enter a valid name which only consist of alphabets and space. The name must be at least 3 letters.'
			);
		}
		return isValidName;
	}

	function isValidRegNo() {
		if (!vendorkkmlistingno) {
			alert('Please enter a valid registration number.');
			return false;
		} else {
			const regNoPattern = /^KKM-[a-zA-Z]{3}-\d{2}-\d{2}-\d{4}$/;
			if (!regNoPattern.test(vendorkkmlistingno)) {
				alert('Please enter a valid registration number in the format KKM-XXX-##-##-####.');
				return false;
			} else {
				return true;
			}
		}
	}

	function isValidTime() {
		if (!businessstarttime || !businessclosingtime) {
			alert('Please enter a valid time.');
			return false;
		} else if (businessstarttime >= businessclosingtime) {
			alert('Please enter a valid time.');
			return false;
		} else {
			return true;
		}
	}

	function validatePhoneNumber() {
		const isValidHp = /^\d{9,11}$/.test(vendorhp);
		if (!isValidHp) {
			alert('Please enter a valid phone number.');
		}
		return isValidHp;
	}

	function validateState() {
		if (vendoraddressstate === '') {
			alert('Please choose a state.');
			return false;
		}
		return true;
	}

	function validatePoscode() {
		const isValidPoscode = /^\d{5}$/.test(vendoraddressposcode);
		if (!isValidPoscode) {
			alert('Please enter a valid poscode.');
		}
		return isValidPoscode;
	}


	function validateaddress() {
		const isValidCity = /^[a-zA-Z ]+$/.test(vendoraddresscity);
		const isValidL1 = /^[a-zA-Z0-9-,. ()/]+$/.test(vendoraddressl1);
		const isValidL2 = /^[a-zA-Z0-9-,. ()/]+$/.test(vendoraddressl2);
		if (!vendoraddressl1 || !vendoraddresscity || !isValidL1 || !isValidL2) {
			alert('Please enter an address for delivery purposes.');
			return false;
		} else if (!isValidCity) {
			alert('Please enter a valid city for delivery purposes.');
			return false;
		}
		return true;
	}

	async function fetchAndDisplayPDF() {
		try {
			const response = await fetch(
				'https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/publicbucket/KKMHomeCookReq.pdf'
			);
			const pdfBlob = await response.blob();
			const url = URL.createObjectURL(pdfBlob);
			window.open(url, '_blank');
		} catch (error) {
			console.error('Error fetching and displaying PDF:', error);
		}
	}
</script>

<div
	class="card-container min-h-[100vh] min-w-[100%] flex justify-center w-[100%] bg-white dark:bg-pdark-100 container-fluid"
>
	<div class="card flex flex-row rounded-[20px] bg-transparent h-[75%] w-[90%] py-[20px] mb-6">
		<div class="flex-1">
			<form action="" class="flex flex-col mt-5 gap-4 px-0">
				<div
					class="registration-text text-center flex-3 text-[40px] mb-4 dark:text-white font-extrabold align-middle mt-3"
				>
					VENDOR REGISTRATION
				</div>
				<div class="formcontainer flex flex-wrap justify-around mt-5 gap-4 w-[100%]">
					<div class="personalinfo flex flex-col gap-4">
						<span class=" dark:text-white font-bold mb-2">Login Information</span>
						<Label>
							<span class=" dark:text-white">Email</span>
							<Input
								type="email"
								name="email"
								placeholder="name@gmail.com"
								required
								bind:value={email}
								class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
								color="white"
							>
								<EnvelopeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>
						<Label>
							<span class=" dark:text-white">Password</span>
							<Input
								type="password"
								name="password"
								placeholder="••••••••••"
								required
								bind:value={password}
								class="w-[325px] text-black password-input dark:bg-[#ECECEC]"
								color="white"
							>
								<LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Confirm Password</span>
							<Input
								type="password"
								name="passwordconfirmation"
								placeholder="••••••••••"
								required
								bind:value={passwordconfirm}
								class="w-[325px] text-black password-input dark:bg-[#ECECEC]"
								color="white"
							>
								<LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<!-- Seperator for Personal Information -->

						<span class=" dark:text-white font-bold mt-9">Personal Information</span>

						<Label>
							<span class=" dark:text-white">Name</span>
							<Input
								type="text"
								name="fullname"
								placeholder="John Doe"
								required
								bind:value={vendorpicname}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<UserSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Contact Information</span>
							<Input
								type="tel"
								name="phone"
								placeholder="0123456789"
								required
								bind:value={vendorhp}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<PhoneSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>
					</div>

					<!-- Business Information -->

					<div class="addressinfo flex flex-col gap-4">
						<span class=" dark:text-white font-bold mb-2">Business Information</span>
						<Label>
							<span class=" dark:text-white">Business Name</span>
							<Input
								type="text"
								name="businessName"
								placeholder="DeliSyok Sdn. Bhd."
								autocomplete="off"
								required
								bind:value={businessname}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<SignHangingSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<!-- svelte-ignore a11y-missing-attribute -->
						<Label>
							<span class=" dark:text-white">KKM Registration Number</span>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<a
								on:click={fetchAndDisplayPDF}
								target="_blank"
								rel="noreferrer"
								class="dark:text-white text-[10px] underline hover:text-purple-400"
								>(What is this?)</a
							>
							<Input
								type="text"
								name="kkmNo"
								placeholder="KKM-FSQ-20-10-0001"
								bind:value={vendorkkmlistingno}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<BuildingColumnsSolid
									slot="left"
									class="w-5 h-5 text-gray-500 dark:text-gray-400"
								/>
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Business Opening Time</span>
							<Input
								type="time"
								step="600"
								name="businessOpeningTime"
								required
								bind:value={businessstarttime}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<DoorOpenSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Business Closing Time</span>
							<Input
								type="time"
								step="600"
								name="businessClosingTime"
								required
								bind:value={businessclosingtime}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<DoorClosedSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Business Operation Day(s)</span>
							<div
								class="days-container border border-gray-700 rounded-[10px] p-5 space-y-3 dark:bg-[#ECECEC]"
							>
								<Toggle class="dark:text-black" bind:checked={mondayToggle}>Monday</Toggle>
								<Toggle class="dark:text-black" bind:checked={tuesdayToggle}>Tuesday</Toggle>
								<Toggle class="dark:text-black" bind:checked={wednesdayToggle}>Wednesday</Toggle>
								<Toggle class="dark:text-black" bind:checked={thursdayToggle}>Thursday</Toggle>
								<Toggle class="dark:text-black" bind:checked={fridayToggle}>Friday</Toggle>
								<Toggle class="dark:text-black" bind:checked={saturdayToggle}>Saturday</Toggle>
								<Toggle class="dark:text-black" bind:checked={sundayToggle}>Sunday</Toggle>
							</div>
						</Label>
					</div>

					<!-- Seperator for Address Information -->
					<div class="addressinfo flex flex-col gap-4">
						<span class=" dark:text-white font-bold mb-2">Address Information</span>
						<Label>
							<span class=" dark:text-white">Address Line 1</span>
							<Input
								type="text"
								name="street-address-1"
								placeholder="Street"
								autocomplete="street-address"
								required
								bind:value={vendoraddressl1}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Address Line 2</span>
							<Input
								type="text"
								name="street-address-2"
								placeholder="Street"
								bind:value={vendoraddressl2}
								class="w-[325px] text-black  dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">City</span>
							<Input
								type="text"
								name="city"
								placeholder="City"
								autocomplete="city"
								required
								bind:value={vendoraddresscity}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Postcode</span>
							<Input
								type="text"
								name="postcode"
								placeholder="Postcode"
								autocomplete="postal-code"
								required
								bind:value={vendoraddressposcode}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">State</span>
							<Select
								items={states}
								bind:states={selectedStates}
								bind:value={vendoraddressstate}
								class="  h-[38px] dark:bg-[#ECECEC] bg-white placeholder:text-black dark:text-pdark-100"
								>States</Select
							>
						</Label>
					</div>
				</div>
				<div class=" flex flex-col items-center">
					<Button type="submit" class="btn-primary w-[325px] mt-9" on:click={handleSignup}
						>Register</Button
					>
					<p class="text-xs font-medium text-gray-500 dark:text-gray-300 mt-2">
						By registering, you agree to the <a href="../../" class="underline"
							>Terms & Conditions</a
						>.
					</p>
				</div>
			</form>
		</div>
	</div>
</div>
