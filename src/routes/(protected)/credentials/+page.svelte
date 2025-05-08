<script lang="ts">
	let { data, form } = $props();

	const credentials = $derived(data.creds)

  const success = $derived(form?.success)
  const message = $derived(form?.message)

  let confirmOpen = $state(false)
  let targetId: string | null = $state(null)

  function ask(id: string) {
    targetId = id
    confirmOpen = true
  }

  function confirm() {
    if (!targetId) return
    // submit the matching form programmatically
    (document.querySelector(`form[data-id="${targetId}"]`) as HTMLFormElement)
      ?.requestSubmit()
    confirmOpen = false
  }
</script>

<svelte:head>
	<title>Credentials | minecontrol</title>
</svelte:head>

{#if message}
  <div class="alert alert-error mb-4">
    <span>{message}</span>
  </div>
{/if}

<div class="mx-auto mt-10 max-w-2xl">
  <div class="mb-6 flex items-center justify-between">
    <h1 class="text-3xl font-bold">AWS Credentials</h1>
    <a href="/credentials/new" class="btn btn-primary">
      + Add new
    </a>
  </div>

  {#if credentials.length}
    <div class="grid gap-4">
      {#each credentials as c}
        <form
          method="post"
          class="card bg-base-200 shadow"
          data-id={c.id}
        >
          <div class="card-body flex-row items-center justify-between">
            <div>
              <h2 class="card-title">
                {c.name || 'Unnamed credential'}
              </h2>
              <p class="text-xs text-gray-400">ID: {c.id}</p>
            </div>

            <input type="hidden" name="id" value={c.id} />
            <button type="button" class="btn btn-error btn-sm" onclick={() => ask(c.id)}>
              Delete
            </button>
          </div>
        </form>
      {/each}
    </div>
  {:else}
    <div class="alert alert-info">
      <span>No credential sets yet.</span>
    </div>
  {/if}
</div>

<input type="checkbox" class="modal-toggle" bind:checked={confirmOpen} />
<div class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Delete this credential?</h3>
    <p class="py-4">Any servers linked to it must be detached first.</p>
    <div class="modal-action">
      <label class="btn btn-error" onclick={confirm}>Yes, delete</label>
      <label class="btn" onclick={() => (confirmOpen = false)}>Cancel</label>
    </div>
  </div>
</div>