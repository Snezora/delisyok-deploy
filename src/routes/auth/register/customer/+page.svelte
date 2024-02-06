<script>
	// @ts-nocheck

	import { Label, Input, Button, Checkbox, Popover, Select } from 'flowbite-svelte';
	import {
		PhoneSolid,
		UserSolid,
		EnvelopeSolid,
		LockSolid,
		HomeSolid,
		CheckOutline,
		CloseOutline
	} from 'flowbite-svelte-icons';
	import { CakeCandlesSolid } from 'svelte-awesome-icons';
	import { supabaseClient } from '$lib/supabase';
	import { navigate } from 'svelte-routing';

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

	let loading = false;
	/**
	 * @type {any}
	 */
	let email;
	/**
	 * @type {any}
	 */
	let password;
	let showPassword = false;
	let showcPassword = false;
	let passwordconfirm;
	let customername;
	let customerhp;
	let customerdob;
	let customeraddressl1;
	let customeraddressl2;
	let customeraddresscity;
	let customeraddressposcode;
	let customeraddressstate;
	let isCustomer = true;

	const handleSignup = async () => {
		console.log(customerdob);
		console.log(customeraddressstate);
		if (
			password == passwordconfirm &&
			isValidName() &&
			validatePhoneNumber() &&
			validateDOB() &&
			validateaddress() &&
			validatePoscode() &&
			validateState()
		) {
			try {
				loading = true;
				console.log(email);

				const { error } = await supabaseClient.auth.signUp({
					email,
					password,
					passwordconfirm,
					customername,
					customerhp,
					customerdob,
					customeraddressl1,
					customeraddressl2,
					customeraddresscity,
					customeraddressposcode,
					customeraddressstate
				});

				if (error) throw error;

				const { error: SigninError } = await supabaseClient.auth.signInWithPassword({
					email,
					password
				});

				if (SigninError) throw SigninError;

				const user = await supabaseClient.auth.getUser();
				const user_id = user.data.user.id;

				const { error: customerError } = await supabaseClient
					.from('customer')
					.insert([
						{
							user_id,
							customeremail: email,
							customername,
							customerhp,
							customerdob,
							customeraddressl1,
							customeraddressl2,
							customeraddresscity,
							customeraddressposcode,
							customeraddressstate
						}
					])
					.select();

				if (customerError) {
					console.log(customerError);
					throw customerError;
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
		} else {
			if(password != passwordconfirm){
				alert('Password does not match');
			}
			loading = false;
		}
	};

	export const form = null;

	//Validation
	function isValidName() {
		if (!customername || customername.length < 3) {
			alert(
				'Please enter a valid name which only consist of alphabets and space. The name must be at least 3 letters.'
			);
			return false;
		}

		const isValidName = /^[a-zA-Z ]+$/.test(customername);
		if (!isValidName) {
			alert(
				'Please enter a valid name which only consist of alphabets and space. The name must be at least 3 letters.'
			);
		}
		return isValidName;
	}

	function validatePhoneNumber() {
		const isValidHp = /^\d{9,11}$/.test(customerhp);
		if (!isValidHp) {
			alert('Please enter a valid phone number.');
		}
		return isValidHp;
	}

	function validateState(){
		if(customeraddressstate === ""){
			alert('Please choose a state.');
			return false;
		}
		return true;
	}

	function validatePoscode() {
		const isValidPoscode = /^\d{5}$/.test(customeraddressposcode);
		if (!isValidPoscode) {
			alert('Please enter a valid poscode.');
		}
		return isValidPoscode;
	}

	function validateDOB() {
		if (!customerdob) {
			alert('Please enter a date of birth.');
			return false;
		}
		return true;
	}

	function validateaddress() {
		const isValidCity = /^[a-zA-Z ]+$/.test(customeraddresscity);
		const isValidL1 = /^[a-zA-Z0-9-,. ]+$/.test(customeraddressl1);
		const isValidL2 = /^[a-zA-Z0-9-,. ]+$/.test(customeraddressl2);
		if (!customeraddressl1 || !customeraddresscity || !isValidL1 || !isValidL2) {
			alert('Please enter an address for delivery purposes.');
			return false;
		}else if(!isValidCity){
			alert('Please enter a valid city for delivery purposes.');
			return false;
		}
		return true;
	}
</script>

<div
	class="card-container min-h-[100vh] max-w-[100%] flex justify-center w-[100%] bg-white dark:bg-pdark-100"
>
	<div
		class="card flex flex-row rounded-[20px] bg-transparent h-[75%] w-[65%] justify-around py-[20px] mb-6"
	>
		<div class="flex-1">
			<form class="flex flex-col justify-around mt-5 gap-4">
				<div
					class="registration-text text-center flex-3 text-[40px] mb-4 dark:text-white font-extrabold align-middle mt-3"
				>
					Customer Registration
				</div>
				<div class="formcontainer flex flex-wrap justify-around mt-5 gap-4">
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
							<div class="relative">
								<Input
									type={showPassword ? 'text' : 'password'}
									name="password"
									placeholder="••••••••••"
									required
									bind:value={password}
									class="w-[325px] text-black password-input dark:bg-[#ECECEC]"
									color="white"
								>
									<LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
								</Input>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
									on:click={() => {
										showPassword = !showPassword;
									}}
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
						</Label>

						<Label>
							<span class=" dark:text-white">Confirm Password</span>
							<div class="relative">
								<Input
									type={showcPassword ? 'text' : 'password'}
									name="passwordconfirmation"
									placeholder="••••••••••"
									required
									bind:value={passwordconfirm}
									class="w-[325px] text-black password-input dark:bg-[#ECECEC]"
									color="white"
								>
									<LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
								</Input>
								<button
									type="button"
									class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
									on:click={() => {
										showcPassword = !showcPassword;
									}}
								>
									{showcPassword ? 'Hide' : 'Show'}
								</button>
							</div>
						</Label>

						<!-- Seperator for Personal Information -->

						<span class=" dark:text-white font-bold mt-9">Personal Information</span>

						<Label>
							<span class=" dark:text-white">Name</span>
							<Input
								type="text"
								name="customername"
								placeholder="John Doe"
								required
								bind:value={customername}
								maxlength="50"
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
								name="customerhp"
								placeholder="0123456789"
								required
								bind:value={customerhp}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<PhoneSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Date of Birth</span>
							<Input
								type="date"
								name="customerdob"
								required
								bind:value={customerdob}
								class="w-[325px] text-black dark:bg-[#ECECEC] placeholder:dark:text-gray-400"
								color="white"
							>
								<CakeCandlesSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>
					</div>

					<div class="addressinfo flex flex-col gap-4">
						<span class=" dark:text-white font-bold mb-2">Delivery Information</span>
						<Label>
							<span class=" dark:text-white">Address Line 1</span>
							<Input
								type="text"
								name="customeraddressl1"
								placeholder="Street"
								autocomplete="street-address"
								required
								bind:value={customeraddressl1}
								class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Address Line 2</span>
							<Input
								type="text"
								name="customeraddressl2"
								placeholder="Street"
								bind:value={customeraddressl2}
								class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">City</span>
							<Input
								type="text"
								name="customeraddresscity"
								placeholder="City"
								autocomplete="city"
								required
								bind:value={customeraddresscity}
								class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
								color="white"
							>
								<HomeSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Postcode</span>
							<Input
								type="text"
								name="customeraddressposcode"
								placeholder="Postcode"
								autocomplete="postal-code"
								required
								bind:value={customeraddressposcode}
								class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
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
								bind:value={customeraddressstate}
								name="customeraddressstate"
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
