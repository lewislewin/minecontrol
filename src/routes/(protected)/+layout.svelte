<script lang="ts">
	let { children, data } = $props();

	const isLoggedIn = $derived(!!data.user);
</script>

{#if isLoggedIn}
	<div class="navbar bg-base-100 shadow-sm">
		<div class="flex-1">
			<a href="/" class="btn btn-ghost text-xl">minecontrol</a>
		</div>
		<div class="flex-none">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/">Home</a></li>
				<li><a href="/user/{data.user.id}">Profile</a></li>
				<li><a href="/logout">Logout</a></li>
			</ul>
		</div>
	</div>
{/if}

<div class="m-5">
	{@render children()}
</div>
