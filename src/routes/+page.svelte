<script lang="ts">
	import type { PageProps } from "./$types";

    let { form }: PageProps = $props()
</script>

<form method="post">
    <label>
        Password
        <input type="password" name="password" id="password">
    </label>
    <button>
        Start Server
    </button>

    {#if form?.error}
    <p>{form.error}</p>
    {/if}
</form>