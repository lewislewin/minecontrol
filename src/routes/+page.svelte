<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	const currentStatus = data.currentStatus;
	const isRunning = $derived(currentStatus === 'running');

	let submitting = $state(false);
</script>

<svelte:head>
  <title>
    Server Starter
  </title>
</svelte:head>

<div class="mx-auto mt-12 max-w-lg rounded-2xl bg-white p-6 shadow">
	<h1 class="mb-4 text-2xl font-semibold">Start MC Server</h1>

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
			disabled={submitting || isRunning}
		>
			{#if submitting}
				<svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
					<circle
						class="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					/>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
				</svg>
				Starting…
			{:else}
				Start Server
			{/if}
		</button>
	</form>
	{#if isRunning}
		<p class="text-red-600">Server is already running</p>
	{/if}

	{#if form}
		{#if form.success}
			<p class="mt-4 text-green-600">
				Started: {form.started.join(', ')}
			</p>
		{:else}
			<p class="mt-4 text-red-600">
				{form.error}
			</p>
		{/if}
	{/if}
</div>
