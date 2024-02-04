<script>
    
    let loading;
    /**
	 * @type {any}
	 */
    let email;
    /**
	 * @type {any}
	 */
    let password;

    /**
	 * @type {boolean}
	 */
    let checked;
    
	import { supabaseClient } from "$lib/supabase";
	import { Label, Input, Checkbox, Button } from "flowbite-svelte";
	import { EnvelopeSolid } from "flowbite-svelte-icons";
	import { LockSolid } from "svelte-awesome-icons";

    	const handleSignup = async() => {
		try {
			loading = true;
			console.log(email);

			const {error} = await supabaseClient.auth.signUp({
				email,
				password
			})
          
			if (error) throw error;

			alert('Sign up successful! We will notify you when your account is approved.')
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

<div class="card-container min-h-[100vh] max-w-[100%] flex justify-center w-[100%] dark:bg-gray-600">
    <div class="infocontainer mt-10 mb-auto">
        <div class="registration-text text-center flex-3 text-[40px] mb-[50px] dark:text-white font-extrabold align-middle mt-3">System Manager Registration</div>
        <div class="formcontainer flex flex-wrap justify-around mt-5 gap-4">
            <div class="personalinfo flex flex-col gap-10 items-center">
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
                        name="pass"
                        placeholder="•••••••••"
                        required
                        bind:value={password}
                        class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
                        color="white"
                    >
                        <LockSolid slot="left" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </Input>
                </Label>
                <div class="checkboxcontainer items-center flex flex-col w-[100%] gap-2">
                    <Checkbox class="text-[16px]" bind:checked={checked}>I confirm that I am an Employee of Delisyok Sdn Bhd.</Checkbox>
                    <span class="text-xs font-bold dark:text-white">Do note our IT managers can only grant you access as a System Manager after checking.</span>
                    <span class="text-xs font-bold dark:text-white">Please notify your supervisor after signing up, and provide your email.</span>
                </div>
                {#if checked}
                    <Button on:click={handleSignup}>Submit Information</Button>
                {:else}
                    <Button disabled>Submit Information</Button>
                {/if}
            </div>
        </div>
    </div>
</div>