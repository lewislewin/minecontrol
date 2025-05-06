<script lang="ts">
	import '../app.css';

	let { children, data } = $props();
</script>

<div class="navbar bg-base-100 shadow-sm">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost text-xl">minecontrol</a>
	</div>
	<div class="flex-none">
		<ul class="menu menu-horizontal px-1">
			<li><a href="/user/{data.user.id}">Profile</a></li>
		</ul>
	</div>
</div>

<div class="m-5">
	{@render children()}
</div>
