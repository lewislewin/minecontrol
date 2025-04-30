<script lang="ts">
    import { enhance } from '$app/forms'
    import type { PageProps } from './$types'
  
    let { data, form }: PageProps = $props()

    let formPending = $state(false);
  </script>
  
  <div class="max-w-lg mx-auto mt-12 p-6 bg-white rounded-2xl shadow">
    <h1 class="text-2xl font-semibold mb-4">Start EC2 Server</h1>
  
    <form
      method="post"
      use:enhance
      class="flex flex-col gap-4"
    >
      <label class="flex flex-col">
        <span class="font-medium">Password</span>
        <input
          name="password"
          type="password"
          required
          class="mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring"
        >
      </label>
  
      <button
        type="submit"
        class="mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50"
        disabled={ formPending }
      >
        {#if formPending}
          <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
          </svg>
          Starting…
        {:else}
          Start Server
        {/if}
      </button>
    </form>
  
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
  