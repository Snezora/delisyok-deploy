<script>
	import { Button } from 'flowbite-svelte';
</script>

<div class="main min-h-[100vh] flex flex-col text-center p-10 gap-10 dark:bg-gray-600 items-center">
    <div class="title text-6xl font-bold dark:text-white">Welcome to Delisyok!</div>
    <div class="subtitle text-2xl font-bold dark:text-white">Access our service by registering/login!</div>
    <div class="seperate grid sm:grid-row-1 md:grid-cols-2">
        <img src="https://iwqnmygskbiilbiiardy.supabase.co/storage/v1/object/public/publicbucket/foodontable.png?t=2024-02-06T15%3A54%3A54.599Z" alt="food on table." class="max-w-full h-auto justify-self-center">
        <div class="textcontainer justify-self-center grid grid-flow-row p-44 gap-10 mb-5">
            <Button href="/auth/login" class="w-[100%] self-center max-h-[100px] h-[100px] text-5xl">Register</Button>
            <Button href="/auth/register" class="w-[100%] self-center max-h-[100px] h-[100px] text-5xl">Login</Button>
        </div>
    </div>
</div>