<script lang='ts'>
    import { Auth } from '@supabase/auth-ui-svelte'
	import { ThemeSupa } from '@supabase/auth-ui-shared'

    export let data
</script>

<div class="row flex-center flex">
	<div class="col-6 form-widget">
		<Auth
			supabaseClient={data.supabase}
			redirectTo={`${data.url}/auth/callback`}
			showLinks={true}
            providers={['google', 'facebook', 'twitter']}
			appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }}
		/>
	</div>
</div>