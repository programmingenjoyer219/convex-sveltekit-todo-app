## Convex Todo App (Svelte Quickstart)

This project is a simple todo application built with [SvelteKit](https://svelte.dev/) and [Convex](https://www.convex.dev/), a type-safe backend-as-a-service (BaaS). It demonstrates how to implement CRUD operations (Create, Read, Update, Delete) in a modular way using Convex.

For more information, refer to the official [Convex documentation](https://docs.convex.dev/home).

---

### 1. Create a SvelteKit App

Run the following command to create a new SvelteKit app:

```bash
npx sv create
```

Follow these steps in the setup prompts:

- **Where would you like your project to be created?**  
  Enter a directory name (e.g., `my-app`) or hit Enter for the current directory.
- **Which template would you like?**  
  Select `SvelteKit minimal`.
- **Add type checking with TypeScript?**  
  Choose `Yes, using TypeScript syntax`.
- **What would you like to add to your project?**  
  Skip this prompt by hitting Enter.
- **Which package manager do you want to install dependencies with?**  
  For this guide, we'll use `npm`.

---

### 2. Install Convex Libraries

Navigate to your project directory and install the required Convex packages:

```bash
cd my-app && npm install convex convex-svelte
```

---

### 3. Configure Convex Path

Create a `convex.json` file to set the Convex functions directory within `src/`:

```json
{
  "functions": "src/convex/"
}
```

---

### 4. Set Up a Convex Dev Deployment

Run the following command:

```bash
npx convex dev
```

This will prompt you to log in with GitHub, create a project, and save your production and deployment URLs. A `convex/` folder will be created for your backend API functions. The `dev` command syncs your functions with your cloud dev deployment.

---

### 5. Add Sample Data to the Database

Create a `sampleData.jsonl` file with the following content:

```jsonl
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```

Import the data into the database:

```bash
npx convex import --table tasks sampleData.jsonl
```

---

### 6. Create a `clientStore`

Set up a store to manage the Convex client:

```ts
// src/lib/stores/clientStore.svelte.ts
import { ConvexClient } from "convex/browser";

interface ClientStore {
  value: ConvexClient | null;
}

export let clientStore = $state<ClientStore>({ value: null });
```

---

### 7. Initialize Convex in the Layout

Add Convex setup to your layout:

```svelte
<script lang="ts">
  // src/routes/+layout.svelte
  import { PUBLIC_CONVEX_URL } from "$env/static/public";
  import { clientStore } from "$lib/stores/clientStore.svelte";
  import { setupConvex, useConvexClient } from "convex-svelte";

  const { children } = $props();

  setupConvex(PUBLIC_CONVEX_URL);

  clientStore.value = useConvexClient();
</script>

<main>
  {@render children()}
</main>

<style>
  main {
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
```

---

### 8. Define the Database Schema

Create a schema for the `tasks` table:

```ts
// src/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
```

---

### 9. Implement Queries and Mutations

Write backend functions for managing tasks:

```ts
// src/convex/tasks.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  handler: async (ctx) => ctx.db.query("tasks").collect(),
});

export const addTask = mutation({
  args: { text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, { text, isCompleted }) => {
    await ctx.db.insert("tasks", { text, isCompleted });
  },
});

export const editTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    await ctx.db.patch(id, { isCompleted: !task?.isCompleted });
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
```

---

### 10. Write Reusable Functions for Mutations

Create utility functions for frontend task operations:

```ts
// src/lib/db/index.ts
import { api } from "$convex/_generated/api.js";
import { clientStore } from "$lib/stores/clientStore.svelte.js";

export function addTask(text: string) {
  clientStore.value?.mutation(api.tasks.addTask, { text, isCompleted: false });
}

export function editTask(id) {
  clientStore.value?.mutation(api.tasks.editTask, { id });
}

export function deleteTask(id) {
  clientStore.value?.mutation(api.tasks.deleteTask, { id });
}
```

---

### 11. Build the Task Form Component

Create a form for adding tasks:

```svelte
<script lang="ts">
  // src/lib/components/CreateNewTask.svelte
  import { addTask } from "$lib/db/index.js";
  let newTask = $state("");
  function handleSubmit(event: Event) {
    event.preventDefault();
    addTask(newTask);
    newTask = "";
  }
</script>

<form onsubmit={handleSubmit}>
  <input type="text" bind:value={newTask} placeholder="New Task" />
  <button type="submit">Add</button>
</form>
```

---

### 12. Display Tasks in Your App

Render tasks in the UI:

```svelte
<script lang="ts">
  // src/routes/+page.svelte
  import { useQuery } from "convex-svelte";
  import { api } from "$convex/_generated/api.js";
  import { editTask, deleteTask } from "$lib/db/index.js";
  import CreateNewTask from "$lib/components/CreateNewTask.svelte";

  const getTasksQuery = useQuery(api.tasks.getTasks, {});
</script>

{#if getTasksQuery.isLoading}
  <p>Loading...</p>
{:else if getTasksQuery.error}
  <p>Error: {getTasksQuery.error.message}</p>
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
        {task.text}
        <button onclick={() => deleteTask(task._id)}>Delete</button>
      </li>
    {/each}
  </ul>
{/if}
```

---

### 13. Start the app

Run the following command:

```bash
npm run dev
```

Start the app, open http://localhost:5173 in a browser, and see the list of tasks.
