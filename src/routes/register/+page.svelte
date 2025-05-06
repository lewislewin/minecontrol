<script lang="ts">
  import { enhance } from '$app/forms'

  // pull in any returned `fail()` data
  let { form } = $props()

  // bind name/email so they survive a validation failure
  let name     = $state(form?.name    ?? '')
  let email    = $state(form?.email   ?? '')
  let submitting = $state(false)

  // derive the error message
  const errorMsg = $derived(form?.error)

  function onEnhance() {
    submitting = true
    return async ({ update }) => {
      await update()
      submitting = false
    }
  }
</script>

<form
  method="POST"
  use:enhance={onEnhance}
  class="card w-full max-w-md mx-auto mt-12 p-6 bg-base-100 shadow-lg"
>
  <h1 class="text-2xl font-semibold text-center mb-4">Register</h1>

  {#if errorMsg}
    <div class="alert alert-error mb-4">
      <span>{errorMsg}</span>
    </div>
  {/if}

  <div class="form-control mb-4">
    <label class="label">
      <span class="label-text">Name</span>
    </label>
    <input
      name="name"
      bind:value={name}
      type="text"
      placeholder="Your full name"
      class="input input-bordered"
    />
  </div>

  <div class="form-control mb-4">
    <label class="label">
      <span class="label-text">Email</span>
    </label>
    <input
      name="email"
      bind:value={email}
      type="email"
      placeholder="you@example.com"
      class="input input-bordered"
    />
  </div>

  <div class="form-control mb-6">
    <label class="label">
      <span class="label-text">Password</span>
    </label>
    <input
      name="password"
      type="password"
      placeholder="••••••••"
      class="input input-bordered"
    />
  </div>

  <button
    type="submit"
    class="btn btn-primary w-full"
    disabled={submitting}
  >
    {#if submitting}Registering…{:else}Register{/if}
  </button>

  <p class="text-center text-sm text-gray-500 mt-4">
    Already have an account?
    <a href="/login" class="link link-primary">Log in</a>
  </p>
</form>
