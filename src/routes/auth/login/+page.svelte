<script>
	import { supabaseClient } from '$lib/supabase';
	import { navigate } from 'svelte-routing';
	import {
		Checkbox,
		Modal,
		Label,
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		Button,
		Input,

		DarkMode

	} from 'flowbite-svelte';


    let googleButtonSVG = "../src/lib/assets/socmed/google_light_round.svg";
    let facebookButtonSVG = "../src/lib/assets/socmed/facebook-svgrepo-com.svg";

	let loading = false;
	/**
	 * @type {any}
	 */
	let email;
	/**
	 * @type {any}
	 */
	let password;

	const handleLogin = async(event) => {
		console.log("before");
		event.preventDefault();
		console.log("after");
    try {
        loading = true;
        const {error} = await supabaseClient.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error;
		window.location.href="/";

    } catch (error) {
        console.error(error);
        alert(error);
    } finally {
        loading = false;
    }
}



// 	const handleLogin = async () => {
//     await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//   }

    
</script>

<div class="flex flex-wrap container-full bg-pdark-100 h-auto">
	<img class="page-image" src="https://via.placeholder.com/846x1024" alt="placeholder" />
	<div
		class=" flex flex-col items-center justify-normal card-holder bg-zinc-100 dark:bg-pdark-100 pt-[50px] pb-[50px] h-auto"
	>
		<form
			class=" flex flex-col items-center justify-center align-middle bg-zinc-100 dark:bg-pdark-100 mb-0 login-form h-auto"
			
			>
			<div
				class="flex flex-col login-card w-[75%] h-[430px] items-center rounded-[30px] dark:bg-pdark-100"
			>
				<div
					class="welcome-text w-[387px] h-[80px] text-center font-bold text-[42px] pt-[30px] dark:text-white"
				>
					Welcome Back!
				</div>
				<div class="login-text text-center pt-2 text-[24px] dark:text-white">
					Login to your account
				</div>
				<Label class="email-label space-y-2 mt-[20px]">
					<span>Email</span>
					<Input
						type="email"
						name="email"
						placeholder="name@gmail.com"
						required
						bind:value={email}
						class="w-[325px] text-black email-input dark:bg-[#ECECEC]"
						color="white"
					/>
				</Label>
				<Label class="space-y-2 mt-[10px] password-label"> <!-- Password -->
					<span>Your password</span>
					<Input
						type="password"
						name="password"
						placeholder="••••••••••"
						required
						bind:value={password}
						class="w-[325px] text-black password-input dark:bg-[#ECECEC]"
						color="white"
					/>
				</Label>
				<div class="flex flex-row mt-[10px] justify-between py-[7px] w-[325px] ">
					<Checkbox>Remember me</Checkbox>
					<a
						href="/"
						class="ml-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
					>
						Forgot password?
					</a>
				</div>
				<Button type="submit" class="w-[325px] mt-4" on:click={(event) => handleLogin(event)} href="/" id="submitbutton">Login</Button>
				<div class="text-sm font-medium text-gray-500 dark:text-gray-300 text-xs mt-1 w-[325px] text-center">
					Don't have an account? Register <a
						href="/auth/register"
						class="text-primary-700 hover:underline dark:text-primary-500">here</a
					>
				</div>
			</div>
		</form>
		<div class="flex flex-col items-center">
			<div class="flex mt-[0px]">
				<!-- OR SEPERATOR -->
				<div
					class="w-[150px] h-[0px] mt-2 mr-2 top-[12px] border dark:border-gray-300 border-black"
				></div>
				<div class="text-sm font-medium text-gray-500 dark:text-gray-300 text-xs mb-1">OR</div>
				<div
					class="w-[150px] h-[0px] mt-2 ml-2 top-[12px] border border-black dark:border-gray-300"
				></div>
			</div>
			<div class="text-sm font-medium text-gray-500 dark:text-gray-300 text-xs mt-2">
				Login with
			</div>
            <div class=" flex flex-row items-center justify-between mt-3 gap-1">
                <input type="image" src={googleButtonSVG} alt="Sign in with Google">
                <input type="image" src={facebookButtonSVG} alt="Sign in with Facebook" class="mb-1">
            </div>
		</div>
	</div>
</div>

<style>


	.page-image {
		width: 50%;
		height: auto;
		object-fit: cover;
	}

	.card-holder {
		width: 50%;
	}

	.welcome-text {
		font-family: 'Poppins', sans-serif;
	}

	@media (max-width: 800px) {
        .container-full{
            height: 100%;
        }

		.page-image {
			object-fit: cover;
			width: 100%;
			height: 200px;
		}

		.card-holder {
            /* position: relative; */
			width: 100%;
            height: 100%;
            padding-top:0px;
            padding-bottom: 50px;
		}

        .login-form{
            width:100%;
        }

		.login-card {
			width: 80%;
			margin-top: 30px;
			padding: 10px;
		}
	}
</style>
