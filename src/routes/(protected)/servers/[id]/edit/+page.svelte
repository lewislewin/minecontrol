<script lang="ts">
	import { enhance } from '$app/forms';
	import { onMount } from 'svelte';

	let { data, form } = $props();

	const server = data.srv;
	const creds = data.creds;

	let submitting = $state(false);
	const success = $derived(form?.success);
	const errorMsg = $derived(form?.error);

	const error = data.error;

	function onEnhance() {
		submitting = true;
		return async ({ update }) => {
			await update();
			submitting = false;
		};
	}

	onMount(() => {
		if (error) {
			alert(error)
		}
	})
</script>
<form
	method="POST"
	use:enhance={onEnhance}
	class="card bg-base-100 mx-auto my-8 w-full shadow-xl lg:w-1/2"
>
	<div class="card-body space-y-4">
		<h2 class="card-title">Edit Server</h2>

		{#if errorMsg}
			<div class="alert alert-error"><span>{errorMsg}</span></div>
		{/if}
		{#if success}
			<div class="alert alert-success"><span>Saved!</span></div>
		{/if}

		<div class="form-control">
			<label class="label"><span class="label-text">Name</span></label>
			<input name="name" type="text" class="input input-bordered" placeholder={server.name} />
		</div>

		<div class="form-control">
			<label class="label"><span class="label-text">Instance ID</span></label>
			<input
				name="instanceId"
				type="text"
				class="input input-bordered"
				placeholder={server.instanceId}
			/>
		</div>

		<div class="form-control">
			<label class="label"><span class="label-text">AWS Credential Set</span></label>
			<select name="credentialId" class="select select-bordered">
				<option value="" disabled>Select…</option>
				{#each creds as c}
					<option value={c.id} selected={c.id === server.credentialId}>
						{c.region} – {c.accessKeyId.slice(0, 6)}…
					</option>
				{/each}
			</select>
		</div>

		<div class="form-control">
			<label class="label" for="password"
				><span id="password" class="label-text">Password for start-link</span></label
			>
			<input name="password" type="password" class="input input-bordered" placeholder="••••••••" />
		</div>

		<div class="card-actions justify-end space-x-2">
			<button type="submit" formaction="?/update" class="btn btn-primary" disabled={submitting}>
				{#if submitting}Saving…{:else}Save Changes{/if}
			</button>
			<button type="submit" formaction="?/delete" class="btn btn-error" disabled={submitting}>
				Delete
			</button>
		</div>
	</div>
</form>
