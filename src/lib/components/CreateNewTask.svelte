<script lang="ts">
  import { addTask } from "$lib/db/index.js";

  let newTask = $state("");

  function handleSubmit(event: Event) {
    event.preventDefault();
    addTask(newTask);
    newTask = "";
  }
</script>

<form onsubmit={handleSubmit} class="flex items-center gap-3 mb-3">
  <input
    type="text"
    name="task"
    bind:value={newTask}
    class="p-3 rounded-md border-2 border-blue-400"
  />
  <button type="submit" class="px-6 py-3 rounded-md bg-blue-400 text-gray-50">
    Add
  </button>
</form>
