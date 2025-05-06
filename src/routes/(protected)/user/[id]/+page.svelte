<script lang="ts">

    let { data } = $props()

    const user = data.user
</script>

{#if user}
    {data.user?.email}
{/if}