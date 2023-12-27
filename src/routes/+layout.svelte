<script lang="ts">
import Footer from "./Footer.svelte";
import "../app.pcss";
import Header from "./Header.svelte";
import Sidebar from "./Sidebar.svelte";
import { supabaseClient } from '$lib/supabase';
import { invalidate, invalidateAll } from '$app/navigation'
import { onMount } from 'svelte'
import { page } from '$app/stores';

export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const {
		data: { subscription },
		} = supabase.auth.onAuthStateChange((event, _session) => {
		if (_session?.expires_at !== session?.expires_at) {
			invalidate('supabase:auth')
		}
		})

		return () => subscription.unsubscribe()
	})

	// Conditionally render the Header based on the current page
	let isClient = $page.url.pathname.startsWith("/client");

</script>

<Header {isClient}/>
<slot />
<Footer />

<style>

</style>