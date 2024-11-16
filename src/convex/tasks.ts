import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db.query("tasks").collect();
		return tasks;
	},
});

export const addTask = mutation({
	args: { text: v.string(), isCompleted: v.boolean() },
	handler: async (ctx, { text, isCompleted }) => {
		await ctx.db.insert("tasks", { text, isCompleted });
	},
});

export const editTask = mutation({
	args: { id: v.id("tasks") },
	handler: async (ctx, args) => {
		const { id } = args;
		const oldTask = await ctx.db.get(id);
		await ctx.db.patch(id, { isCompleted: !oldTask?.isCompleted });
	},
});

export const deleteTask = mutation({
	args: { id: v.id("tasks") },
	handler: async (ctx, args) => {
		const { id } = args;
		await ctx.db.delete(id);
	},
});
