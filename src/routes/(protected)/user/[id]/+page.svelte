<script lang="ts">
    import { enhance } from '$app/forms'
    import { onMount } from 'svelte'
  
    let { data, form } = $props()
  
    const user      = $derived(data?.user)
    const success   = $derived(form?.success)
    const errorMsg  = $derived(form?.error)
  
    let submitting  = $state(false)
  
    function onEnhance() {
      submitting = true
      return async ({ update }) => {
        await update()
        submitting = false
      }
    }
  
    onMount(() => {
      if (errorMsg) alert(errorMsg)
    })
  </script>
  
  <svelte:head>
    <title>Profile | minecontrol</title>
  </svelte:head>
  
  <form
    method="POST"
    action="?/update"
    use:enhance={onEnhance}
    class="card bg-base-100 mx-auto my-8 w-full shadow-xl lg:w-1/2"
  >
    <div class="card-body space-y-4">
      <h2 class="card-title">Edit Profile</h2>
  
      {#if success}
        <div class="alert alert-success"><span>Saved!</span></div>
      {/if}
  
      <div class="form-control">
        <label class="label" for="id"><span id="name" class="label-text">Name</span></label>
        <input
          name="name"
          type="text"
          class="input input-bordered"
          placeholder={user.name}
        />
      </div>
  
      <div class="form-control">
        <label class="label"><span class="label-text">Email</span></label>
        <input
          name="email"
          type="email"
          class="input input-bordered"
          placeholder={user.email}
        />
      </div>
  
      <div class="form-control">
        <label class="label"><span class="label-text">New Password</span></label>
        <input
          name="password"
          type="password"
          class="input input-bordered"
          placeholder="••••••••"
        />
      </div>
  
      <div class="card-actions justify-end">
        <button type="submit" class="btn btn-primary" disabled={submitting}>
          {#if submitting}Saving…{:else}Save Changes{/if}
        </button>
      </div>
    </div>
  </form>
  