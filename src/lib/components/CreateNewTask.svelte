<script lang="ts">
  import { addTask } from "$lib/db/index.js";

  let newTask = $state("");

  function handleSubmit(event: Event) {
    event.preventDefault();
    addTask(newTask);
    newTask = "";
  }
</script>

<form onsubmit={handleSubmit}>
  <input type="text" name="task" bind:value={newTask} />
  <button type="submit">Add</button>
</form>
