<script lang="ts">
    import { enhance } from '$app/forms'
    let err = ''
    const act = () => enhance(async ({ update }) => {
      const res = await update()
      if (res?.error) err = res.error
    })
  </script>
  
  <form method="post" use:act class="space-y-4 max-w-xs">
    <input name="email"    placeholder="email"    class="border p-2 w-full" required>
    <input name="password" placeholder="password" class="border p-2 w-full" type="password" required>
    <button class="bg-blue-600 text-white px-4 py-2 rounded w-full">Log in</button>
    {#if err}<p class="text-red-600">{err}</p>{/if}
  </form>
  