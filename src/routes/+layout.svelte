<script lang="ts">
import Footer from "./Footer.svelte";
import "../app.pcss";
import Header from "./Header.svelte";
import { supabaseClient } from '$lib/supabase';
import { invalidate, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'

// export let data

	// let { supabase, session } = data
	// $: ({ supabase, session } = data)

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => subscription.unsubscribe()
	})

</script>

<Header />
<slot />
<Footer />

<style>

</style>