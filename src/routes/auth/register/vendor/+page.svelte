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
								pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
								name="phone"
								placeholder="+60 123 456 789"
								required
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
								class="w-[325px] text-black dark:bg-[#ECECEC] placeholder:dark:text-gray-400"
								color="white"
							>
								<CakeCandlesSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
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
								autocomplete = "off"
								required
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<SignHangingSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">KKM Registration Number</span>
							<a
								href="../../src\lib\assets\files\KKMHomeCookReq.pdf"
								target="_blank"
								rel="noreferrer"
								class="dark:text-white text-[10px] underline hover:text-purple-400"
								>(What is this?)</a
							>
							<Input
								type="text"
								name="kkmNo"
								placeholder="KKM-FSQ-20-10-0001"
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
								class="w-[325px] text-black dark:bg-[#ECECEC]"
								color="white"
							>
								<DoorClosedSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
							</Input>
						</Label>

						<Label>
							<span class=" dark:text-white">Business Operation Day(s)</span>
							<div class="days-container border border-gray-700 rounded-[10px] p-5 space-y-3 dark:bg-[#ECECEC] ">
								<Toggle class="dark:text-black">Monday</Toggle>
								<Toggle class="dark:text-black">Tuesday</Toggle>
								<Toggle class="dark:text-black">Wednesday</Toggle>
								<Toggle class="dark:text-black">Thursday</Toggle>
								<Toggle class="dark:text-black">Friday</Toggle>
								<Toggle class="dark:text-black">Saturday</Toggle>
								<Toggle class="dark:text-black">Sunday</Toggle>
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
								class="  h-[38px] dark:bg-[#ECECEC] bg-white placeholder:text-black dark:text-pdark-100"
								>States</Select
							>
						</Label>
					</div>
				</div>
				<div class=" flex flex-col items-center">
					<Button type="submit" class="btn-primary w-[325px] mt-9">Register</Button>
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

<!-- <Popover class="text-sm" triggeredBy=".password-input" placement="bottom">
    <h3 class="font-semibold text-gray-900 dark:text-white">Must have at least 6 characters</h3>
    <div class="grid grid-cols-4 gap-2">
      <div class="h-1 bg-orange-300 dark:bg-orange-400" />
      <div class="h-1 bg-orange-300 dark:bg-orange-400" />
      <div class="h-1 bg-gray-200 dark:bg-gray-600" />
      <div class="h-1 bg-gray-200 dark:bg-gray-600" />
    </div>
    <p class="py-2">It’s better to have:</p>
    <ul>
      <li class="flex items-center mb-1">
        <CheckOutline class="me-2 w-4 h-4 text-green-400 dark:text-green-500" />
        Upper &amp; lower case letters
      </li>
      <li class="flex items-center mb-1">
        <CheckOutline class="me-2 w-4 h-4 text-green-400 dark:text-green-500" />
        A symbol (#$&amp;)
      </li>
      <li class="flex items-center">
        <CloseOutline class="me-2 w-4 h-4 text-gray-300 dark:text-gray-400" />A longer password (min. 12 chars.)
      </li>
    </ul>
  </Popover> -->
