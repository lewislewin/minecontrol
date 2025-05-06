<script lang="ts">
    import { enhance } from '$app/forms'
  
    let { form } = $props()
  
    let submitting = false
    let newCred: { accessKeyId: string, region: string } | null = null
  
    const onEnhance = () => {
      submitting = true
      return async ({ update }) => {
        const res = await update()
        if (res.success) {
          newCred = res.cred
        }
        submitting = false
      }
    }
  </script>
  
  <svelte:head>
    <title>Add AWS Credential</title>
  </svelte:head>
  
  <div class="max-w-md mx-auto mt-8">
    <h1 class="text-2xl font-semibold mb-4">Add Credential</h1>
  
    <form method="post" use:enhance={onEnhance} class="space-y-4">
      <label class="block">
        <span class="font-medium">Access Key ID</span>
        <input name="accessKeyId" required class="mt-1 w-full border px-3 py-2 rounded"/>
      </label>
  
      <label class="block">
        <span class="font-medium">Secret Access Key</span>
        <input name="secretAccessKey" type="password" required class="mt-1 w-full border px-3 py-2 rounded"/>
      </label>
  
      <label class="block">
        <span class="font-medium">Region</span>
        <input name="region" required class="mt-1 w-full border px-3 py-2 rounded"/>
      </label>
  
      <button
        type="submit"
        class="mt-2 w-full rounded-xl bg-blue-600 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
        disabled={submitting}
      >
        {#if submitting}Adding…{:else}Add Credential{/if}
      </button>
    </form>
  
    {#if newCred}
      <p class="mt-4 text-green-600">
        Added: {newCred.accessKeyId} ({newCred.region})
      </p>
    {/if}
  </div>
  