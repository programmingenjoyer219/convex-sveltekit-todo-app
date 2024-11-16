import { api } from "$convex/_generated/api.js";
import type { Id } from "$convex/_generated/dataModel.js";
import { clientStore } from "$lib/stores/clientStore.svelte.js";

export function editTask(id: Id<"tasks">) {
	clientStore.value
		? clientStore.value.mutation(api.tasks.editTask, { id })
		: console.error("clientStore is not initialised");
}

export function deleteTask(id: Id<"tasks">) {
	clientStore.value
		? clientStore.value.mutation(api.tasks.deleteTask, { id })
		: console.error("clientStore is not initialised");
}

export function addTask(newTask: string) {
	clientStore.value
		? clientStore.value.mutation(api.tasks.addTask, {
				text: newTask,
				isCompleted: false,
			})
		: console.error("clientStore is not initialised");
}
