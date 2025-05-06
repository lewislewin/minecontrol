<script lang="ts">
    import { enhance } from '$app/forms'

    let { data } = $props()

    const info = data.info
    const server = data.srv

    const isRunning = $derived(info.state === 'running')
  </script>

<form method="POST" action="stop" class="card card-border bg-base-100 w-3xl">
  <div class="card-body">
    <h2 class="card-title">{server.name ?? server.id}</h2>
    <p>{server.instanceId}</p>
    <p>Status: {info.state}</p>
    <p>IP: {info.publicIp}</p>

    <div class="card-actions justify-end">
      <button class="btn btn-primary" disabled={isRunning}>Start</button>
      <button class="btn btn-primary" disabled={!isRunning}>Stop</button>
      <button class="btn btn-primary" disabled={!isRunning}>Reboot</button>
    </div>
  </div>
</form>