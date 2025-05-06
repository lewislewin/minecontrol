  <script lang="ts">
    import { enhance } from '$app/forms'
    export let data:{ creds:{ id:string; region:string }[] }
    let done = false
    let token = ''
    const act = () => enhance(async ({ update }) => {
      const res = await update()
      done = res?.success
      token = res?.token
    })
  </script>
  
  {#if done}
    <p class="mt-4">Server created. Start link: <code>{location.origin}/start/{token}</code></p>
  {:else}
    <form method="post" use:act class="space-y-4 max-w-md">
      <label class="block">
        <span>Instance ID</span>
        <input name="instanceId" class="border p-2 w-full" required>
      </label>
  
      <label class="block">
        <span>AWS Credential set</span>
        <select name="credentialId" class="border p-2 w-full">
          {#each data.creds as c}
            <option value={c.id}>{c.region} – {c.id.slice(0,6)}…</option>
          {/each}
        </select>
      </label>
  
      <label class="block">
        <span>Password for start-link</span>
        <input name="password" type="password" class="border p-2 w-full" required>
      </label>
  
      <button class="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
    </form>
  {/if}
  