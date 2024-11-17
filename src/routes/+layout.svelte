<script lang="ts">
  import { PUBLIC_CONVEX_URL } from "$env/static/public";
  import { clientStore } from "$lib/stores/clientStore.svelte";
  import { setupConvex } from "convex-svelte";
  import { useConvexClient } from "convex-svelte";

  const { children } = $props();
  // Set up Convex
  setupConvex(PUBLIC_CONVEX_URL);
  // Initialize clientStore: It will be used to perform mutations
  clientStore.value = useConvexClient();
</script>

<main class="min-h-dvh flex flex-col items-center justify-center">
  {@render children()}
</main>
