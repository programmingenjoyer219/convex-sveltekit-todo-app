<script lang="ts">
  import { useQuery } from "convex-svelte";
  import { api } from "$convex/_generated/api.js";
  import { deleteTask, editTask } from "$lib/db/index.js";
  import CreateNewTask from "$lib/components/CreateNewTask.svelte";

  const getTasksQuery = useQuery(api.tasks.getTasks, {});
</script>

<div class="container mx-auto max-w-4xl">
  {#if getTasksQuery.isLoading}
    <p>Loading...</p>
  {:else if getTasksQuery.error}
    <p>
      failed to load: {getTasksQuery.error.toString()}
    </p>
  {:else}
    <CreateNewTask />

    <ul class="space-y-3">
      {#each getTasksQuery.data as task (task._id)}
        <li class="grid grid-cols-3 gap-1">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onchange={() => editTask(task._id)}
            class="size-6"
          />
          <span>{task.text}</span>
          <button
            onclick={() => deleteTask(task._id)}
            class="bg-red-400 text-gray-50 p-1 rounded-md"
            >delete
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
