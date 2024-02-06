<script>
	// @ts-nocheck

	import { Label, Input, Button, Checkbox, Popover, Select, Toggle, Fileupload } from 'flowbite-svelte';
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
		AddressCardSolid,
		BuildingColumnsSolid,
		CakeCandlesSolid,
		CalendarCheckSolid,
		CarRearSolid,
		ClockSolid,
		DoorClosedSolid,
		DoorOpenSolid,
		IdCardSolid,
		SignHangingSolid
	} from 'svelte-awesome-icons';
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
	let ridername;
	let riderhp;
	let riderdob;
	let ridervehicleplate;
	let rideric;
	let riderlicense;
	let licenseexpirydate;
	let rideraddressl1;
	let rideraddressl2;
	let rideraddresscity;
	let rideraddressposcode;
	let rideraddressstate;
	let licensephoto;
	let photourl;

	const handleSignup = async() => {
		try {
			loading = true;
			console.log(email);

			const {error} = await supabaseClient.auth.signUp({
				email,
				password
			})
          
			if (error) throw error;

			const {error: SigninError} = await supabaseClient.auth.signInWithPassword({
				email,
				password
			})

			if (SigninError) throw SigninError;

			const file = licensephoto[0];
			const fileExt = file.name.split('.').pop();
			const filePath = `riderlicenseimage/${Math.random()}.${fileExt}`;

			photourl = filePath;
			console.log(licensephoto);
			console.log(photourl);

			const { error: imageerror } = await supabaseClient.storage.from('deliveryriderimage').upload(filePath, file);
			if (imageerror) throw imageerror;


			const user = await supabaseClient.auth.getUser();
			const user_id = user.data.user.id;

			const { error: riderError } = await supabaseClient
			.from('deliveryrider')
			.insert([
				{
					user_id,
					rideremail: email,
					ridername,
					riderhp,
					riderdob,
					rideraddressl1,
					rideraddressl2,
					rideraddresscity,
					rideraddressposcode,
					rideraddressstate,
					rideric,
					riderlicense,
					licenseexpirydate,
					ridervehicleplate,
					licensephotourl: photourl
				},
			])
			.select();

			if (riderError) {
				console.log(riderError);
				throw riderError;
			}
			
			alert('Sign up successful!')
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
</script>

<div
	class="card-container min-h-[100vh] min-w-[100%] flex justify-center w-[100%] bg-white dark:bg-pdark-100 container-fluid"
>
	<div
		class="card flex flex-row rounded-[20px] bg-transparent h-[75%] w-[90%] py-[20px] mb-6"
	>
		<div class="flex-1">
			<form action="" class="flex flex-col mt-5 gap-4 px-0">
				<div
					class="registration-text text-center flex-3 text-[40px] mb-4 dark:text-white font-extrabold align-middle mt-3"
				>
					DELIVERY RIDER REGISTRATION
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
								bind:value={ridername}
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
								bind:value={riderhp}
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
								name="phone"
								required
								bind:value={riderdob}
								class="w-[325px] text-black dark:bg-[#ECECEC] placeholder:dark:text-gray-400"
								color="white"
							>
								<CakeCandlesSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>
					</div>

					<!-- Rider Driving Information -->

					<div class="addressinfo flex flex-col gap-4">
						<span class=" dark:text-white font-bold mb-2">Rider Information</span>
						<Label>
							<span class=" dark:text-white">Vehicle Registration Number</span>
							<Input
								type="text"
								name="vehicleNo"
								placeholder="VKL3029"
								autocomplete = "off"
								required
								bind:value={ridervehicleplate}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<CarRearSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">IC Number</span>
							<Input
								type="string"
								name="rideric"
								required
								bind:value={rideric}
								placeholder="090930203029"
								class="w-[325px] text-black dark:bg-[#ECECEC] placeholder:dark:text-gray-400"
								color="white"
							>
								<AddressCardSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Driver's License Number</span>
							<!-- <a
								href="../../src\lib\assets\files\KKMHomeCookReq.pdf"
								target="_blank"
								rel="noreferrer"
								class="dark:text-white text-[10px] underline hover:text-purple-400 dark:hover:text-purple-400"
								>(What is this?)</a
							> -->
							<Input
								type="text"
								name="licenseNo"
								placeholder="01010101"
								required
								bind:value={riderlicense}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<IdCardSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400"/>
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">License Expiry Date</span>
							<Input
								type="date"
								name="licenseExpiry"
								required
								bind:value={licenseexpirydate}
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<CalendarCheckSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Delivery License Image</span>
							<Fileupload accept=".png, .jpg, .jpeg" color="white" class="border-none m-[1px] dark:text-white" bind:files={licensephoto}></Fileupload>
							<!-- <Input
								type="file"
								name="businessClosingTime"
								required
								accept = "image/*"
								class="w-[325px] text-black "
								color="white"
							>
							</Input> -->
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
								bind:value={rideraddressl1}
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
								bind:value={rideraddressl2}
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
								bind:value={rideraddresscity}
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
								bind:value={rideraddressposcode}
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
								bind:value={rideraddressstate}
								class="  h-[38px] dark:bg-[#ECECEC] bg-white placeholder:text-black dark:text-pdark-100"
								>States</Select
							>
						</Label>
					</div>
				</div>
				<div class=" flex flex-col items-center">
					<Button type="submit" class="btn-primary w-[325px] mt-9" on:click={handleSignup}>Register</Button>
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