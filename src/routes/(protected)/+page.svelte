<script lang="ts">
	let { data } = $props();

	const servers = data.servers;
</script>

<ul class="mb-10">
	<p>Quick Links</p>
	<li>
		<a class="btn btn-primary" href="/credentials">Credentials</a>
	</li>
</ul>

<h1 class="mb-4 text-2xl font-bold">My Servers</h1>

<a href="/servers/new" class="btn btn-primary">+ Add new</a>
{#await servers}
	Loading...
{:then servers}
	<ul class="mt-6 space-y-2">
		{#each servers as server}
			<div class="card bg-base-100 w-96 shadow-sm">
				<div class="card-body">
					<h2 class="card-title">{server.name ?? server.id}</h2>
					<p>{server.instanceId}</p>
					<div class="card-actions justify-end">
						<a class="btn btn-primary" href="/servers/{server.id}">Edit</a>
					</div>
				</div>
			</div>
		{/each}
	</ul>
{/await}
