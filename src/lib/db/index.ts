import { api } from "$convex/_generated/api.js";
import type { Id } from "$convex/_generated/dataModel.js";
import { clientStore } from "$lib/stores/clientStore.svelte.js";

// Mutations can insert, update, and remove data from database tables.
// clientStore (initialized in +layout.svelte) will be used to perform these mutations.

export function addTask(text: string) {
  clientStore.value?.mutation(api.tasks.addTask, { text, isCompleted: false });
}

export function editTask(id: Id<"tasks">) {
  clientStore.value?.mutation(api.tasks.editTask, { id });
}

export function deleteTask(id: Id<"tasks">) {
  clientStore.value?.mutation(api.tasks.deleteTask, { id });
}