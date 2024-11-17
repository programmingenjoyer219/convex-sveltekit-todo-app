<script lang="ts">
  import { useQuery } from "convex-svelte";
  import { api } from "$convex/_generated/api.js";
  import { deleteTask, editTask } from "$lib/db/index.js";
  import CreateNewTask from "$lib/components/CreateNewTask.svelte";

  // Query to fetch tasks from database
  const getTasksQuery = useQuery(api.tasks.getTasks, {});
</script>

<div>
  {#if getTasksQuery.isLoading}
    <p>Loading...</p>
  {:else if getTasksQuery.error}
    <p>
      failed to load: {getTasksQuery.error.toString()}
    </p>
  {:else}
    <CreateNewTask />

    <ul>
      {#each getTasksQuery.data as task (task._id)}
        <li>
          <input
            type="checkbox"
            checked={task.isCompleted}
            onchange={() => editTask(task._id)}
          />
          <span>{task.text}</span>
          <button onclick={() => deleteTask(task._id)}>delete</button>
        </li>
      {/each}
    </ul>
  {/if}
</div>
