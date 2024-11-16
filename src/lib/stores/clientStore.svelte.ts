import { ConvexClient } from "convex/browser";

export let clientStore = $state<{ value: ConvexClient | null }>({
	value: null,
});
