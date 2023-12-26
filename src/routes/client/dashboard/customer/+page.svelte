<script>
    /** @type {import('./$types').PageData} */
    import { supabaseClient } from "$lib/supabase";
    import { onMount } from 'svelte';

    let user;

    onMount(async () => {
    const { data, error } = await supabaseClient
        .from('customer')
        .select('*')
        .eq('customeremail', (await supabaseClient.auth.getUser()).data.user?.email)
        .single();

    if (error) {
        // Handle error
    } else if (data) {
        // User exists in the Customer Table
        user = data;
    } else {
        // User does not exist in the Customer Table
        // Redirect or display error message
    }
    });

    export let data;

</script>