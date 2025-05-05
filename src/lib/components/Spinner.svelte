<script lang="ts">
    let { size = 20 }: { size: number } = $props()
</script>

<svg
  class="h-{size} w-{size} animate-spin"
  viewBox="0 0 24 24"
>
  <circle
    class="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    stroke-width="4"
  />
  <path
    class="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
  />
</svg>