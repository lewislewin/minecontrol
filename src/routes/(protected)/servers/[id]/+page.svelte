<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { CheckCircle, Slash, RefreshCw } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { preventDefault } from 'svelte/legacy';

	let { data, form } = $props();

	const success = $derived(form?.success);
	const errorMsg = $derived(form?.error);

	const info = $derived(data.info);
	const server = $derived(data.srv);

	const isRunning = $derived(info.state === 'running');
	const canBeStopped = $derived(!isRunning);
	const canBeStarted = $derived(info.state !== 'running');

	const loggedIn = $derived(!!data.user);

	let submitting = $state(false);

	function onEnhance() {
		submitting = true;
		return async ({ update }) => {
			await update();
			await invalidateAll();
			submitting = false;
		};
	}

	async function reload() {
		await invalidateAll();
	}

	onMount(() => {
		const interval = setInterval(() => {
			reload()
		}, 5000)

		return () => {
			clearInterval(interval)
		}
	})
</script>

<svelte:head>
	<title>
		{server.name ?? server.instanceId} | minecontrol
	</title>
</svelte:head>
<form
	method="POST"
	use:enhance={onEnhance}
	class="card bg-base-100 mx-auto my-8 w-full max-w-3xl shadow-md"
>
	<div class="card-body space-y-4">
		<div class="flex items-center justify-between">
			<h2 class="card-title text-xl font-semibold">
				{server.name ?? server.instanceId}
			</h2>
			{#if isRunning}
				<CheckCircle class="h-6 w-6 text-green-500" />
			{:else}
				<Slash class="h-6 w-6 text-red-500" />
			{/if}
		</div>

		<p>
			<span class="font-medium">ID:</span>
			{server.instanceId}
		</p>
		<p>
			<span class="font-medium">Status:</span>
			<span
				class="inline-block rounded-full px-2 py-1 text-sm font-medium"
				class:bg-green-100={isRunning}
				class:text-green-800={isRunning}
				class:bg-red-100={!isRunning}
				class:text-red-800={!isRunning}
			>
				{info.state}
			</span>
		</p>
		<p>
			<span class="font-medium">IP:</span>
			{info.publicIp}
		</p>

		{#if !loggedIn}
			<label class="block">
				<span class="font-medium">Password</span>
				<input
					type="password"
					name="password"
					required
					class="mt-1 block w-full rounded-lg border px-3 py-2 focus:ring focus:outline-none"
				/>
			</label>
		{/if}

		{#if !success && errorMsg}
			<p class="text-red-600">{errorMsg}</p>
		{/if}
		<div class="flex justify-between">
			<div class="card-actions">
				<button class="btn" onclick={preventDefault(reload)}>Reload</button>
			</div>
			<div class="card-actions space-x-2">
				<button
					type="submit"
					formaction="?/start"
					class="btn btn-success flex items-center gap-2"
					disabled={submitting || !canBeStarted}
				>
					<RefreshCw class="h-4 w-4" />
					Start
				</button>

				{#if loggedIn}
					<button
						type="submit"
						formaction="?/stop"
						class="btn btn-warning flex items-center gap-2"
						disabled={submitting || canBeStopped}
					>
						<Slash class="h-4 w-4" />
						Stop
					</button>

					<button
						type="submit"
						formaction="?/restart"
						class="btn btn-info flex items-center gap-2"
						disabled={submitting || canBeStopped}
					>
						<RefreshCw class="h-4 w-4 rotate-90" />
						Reboot
					</button>
				{/if}
			</div>
		</div>

		{#if submitting}
			<div class="mt-2 flex justify-center">
				<Spinner size={24} />
			</div>
		{/if}
	</div>
</form>
