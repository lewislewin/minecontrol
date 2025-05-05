<script lang="ts">
	import { enhance } from '$app/forms'
	import type { PageProps } from './$types'
	import Spinner from '$lib/Spinner.svelte'

	let { data, form }: PageProps = $props()

	const currentStatus = data.currentStatus
	const canBeStarted = $derived(currentStatus === 'stopped')

	const serverIp = data.publicIp

	let submitting = $state(false)
</script>

<svelte:head>
	<title>Server Starter</title>
</svelte:head>

<div class="mx-auto mt-12 max-w-lg rounded-2xl bg-white p-6 shadow">
	<h1 class="mb-4 text-2xl font-semibold">Start MC Server</h1>
	<p>Current IP: {serverIp}</p>
	<p>Current Status: {currentStatus}</p>
	{#if canBeStarted}
		<form
			method="post"
			use:enhance={() => {
				submitting = true;

				return async ({ update }) => {
					await update();
					submitting = false;
				};
			}}
			class="flex flex-col gap-4"
		>
			<label class="flex flex-col">
				<span class="font-medium">Password</span>
				<input
					name="password"
					type="password"
					required
					class="mt-1 rounded-lg border px-3 py-2 focus:ring focus:outline-none"
				/>
			</label>

			<button
				type="submit"
				class="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
				disabled={submitting}
			>
				{#if submitting}
					<Spinner size={20} />
					Starting…
				{:else}
					Start Server
				{/if}
			</button>
		</form>
	{/if}
	{#if !canBeStarted}
		<p class="text-red-600">Server cannot be started</p>
	{/if}

	{#if form}
		{#if form.success}
			<p class="mt-4 text-green-600">
				Started: {form.started?.join(', ')}
			</p>
		{:else}
			<p class="mt-4 text-red-600">
				{form.error}
			</p>
		{/if}
	{/if}
</div>
