<script lang="ts">
	let { data } = $props();

	const servers = $derived(data.servers)

	function copyLink(id: string) {
		const url = `${location.origin}/servers/${id}`
		navigator.clipboard.writeText(url)
	}
</script>

<svelte:head>
  <title>Home | minecontrol</title>
</svelte:head>

<div class="container mx-auto p-6">
  <!-- header + add button -->
  <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
    <h1 class="text-3xl font-bold mb-4 md:mb-0">My Servers</h1>
    <a href="/servers/new" class="btn btn-primary">
      + Add New Server
    </a>
  </div>

  <!-- quick links -->
  <section class="mb-8">
    <h2 class="text-xl font-semibold mb-2">Quick Links</h2>
    <div class="flex flex-wrap gap-4">
      <a href="/credentials"      class="btn btn-outline">Credentials</a>
      <a href="/credentials/new"  class="btn btn-outline">Add Credentials</a>
      <a href="/servers"          class="btn btn-outline">Servers List</a>
    </div>
  </section>

  <!-- server grid -->
  {#if servers.length > 0}
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each servers as srv}
        <div class="card bg-base-100 shadow hover:shadow-lg transition-shadow">
          <div class="card-body">
            <h2 class="card-title">{srv.name ?? srv.id}</h2>
            <p class="text-sm text-gray-500">Instance: {srv.instanceId}</p>

            <div class="card-actions justify-between mt-4">
              <button
                on:click={() => copyLink(srv.id)}
                class="btn btn-sm btn-outline"
              >
                Copy Start Link
              </button>

              <div class="space-x-2">
                <a
                  href={`/servers/${srv.id}`}
                  class="btn btn-sm btn-primary"
                >
                  View
                </a>
                <a
                  href={`/servers/${srv.id}/edit`}
                  class="btn btn-sm btn-secondary"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-center text-gray-500">
      You don’t have any servers yet.
      <a href="/servers/new" class="link link-primary">Add one now</a>.
    </p>
  {/if}
</div>