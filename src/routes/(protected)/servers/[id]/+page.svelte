<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';

	let { data, form } = $props();

	const success = $derived(form?.success)
	const error = $derived(form?.error)

	const info = data.info;
	const server = data.srv;

	const isRunning = $derived(info.state === 'running');
	const loggedIn = $state(!!data.user);

	let submitting = $state(false);
</script>

<form
	method="POST"
	use:enhance={() => {
		submitting = true

		return async ({ update }) => {
			await update()
			submitting = false
		};
	}}
>
	<div class="card-body">
		<h2 class="card-title">{server.name ?? server.instanceId}</h2>
		<p>ID: {server.instanceId}</p>
		<p>Status: {info.state}</p>
		<p>IP: {info.publicIp}</p>
		{#if ! loggedIn}
			<label for="password">
				<input type="password" name="password" id="password" />
			</label>
		{/if}
		{#if !success && error}
			<p>{error}</p>
		{/if}
		<div class="card-actions">
			<button class="btn btn-primary" type="submit" formaction="?/start" disabled={isRunning}
				>Start</button
			>
			{#if loggedIn}
				<button class="btn btn-primary" type="submit" formaction="?/stop" disabled={!isRunning}
					>Stop</button
				>
				<button class="btn btn-primary" type="submit" formaction="?/restart" disabled={!isRunning}
					>Reboot</button
				>
			{/if}
		</div>
	</div>
</form>

{#if submitting}
	<Spinner size={20} />
{/if}
