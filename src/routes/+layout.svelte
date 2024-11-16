<script lang="ts">
  	import { PUBLIC_CONVEX_URL } from '$env/static/public';
    import { clientStore } from '$lib/stores/clientStore.svelte';
	import { setupConvex } from 'convex-svelte';
	import { useConvexClient } from "convex-svelte";

	const { children } = $props();
	
	setupConvex(PUBLIC_CONVEX_URL);

	clientStore.value = useConvexClient();
</script>

<main class="min-h-dvh flex flex-col items-center justify-center">
  {@render children()}
</main>
