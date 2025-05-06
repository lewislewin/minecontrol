<script lang="ts">
    export let data: {
      creds: {
        id: string
        accessKeyId: string
        region: string
      }[]
    }
  </script>
  
  <svelte:head>
    <title>Credentials | minecontrol</title>
  </svelte:head>
  
  <div class="max-w-md mx-auto mt-8 space-y-4">
    <h1 class="text-2xl font-semibold">AWS Credentials</h1>
    <a href="/credentials/new" class="text-blue-600 underline">+ Add new</a>
  
    {#if data.creds.length}
      <ul class="space-y-2">
        {#each data.creds as c}
          <li class="border p-3 rounded flex justify-between">
            <span>{c.accessKeyId}</span>
            <span class="text-sm text-gray-500">{c.region}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="text-gray-600">No credential sets yet.</p>
    {/if}
  </div>
  