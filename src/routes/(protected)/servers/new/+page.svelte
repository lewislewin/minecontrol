<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const id = form?.id;
</script>

{#if id}
	<p class="mt-4">Server created. Start link: <code>{location.origin}/start/{id}</code></p>
{:else}
	<form method="post" use:enhance class="max-w-md space-y-4">
		<label class="block">
			<span>Name</span>
			<input name="name" class="w-full border p-2" required />
		</label>

		<label class="block">
			<span>Instance ID</span>
			<input name="instanceId" class="w-full border p-2" required />
		</label>

		<label class="block">
			<span>AWS Credential set</span>
			<select name="credentialId" class="w-full border p-2">
				{#each data.creds as c}
					<option value={c.id}>{c.region} – {c.id.slice(0, 6)}…</option>
				{/each}
			</select>
		</label>

		<label class="block">
			<span>Password for start-link</span>
			<input name="password" type="password" class="w-full border p-2" required />
		</label>

		<button class="rounded bg-blue-600 px-4 py-2 text-white">Create</button>
	</form>
{/if}
