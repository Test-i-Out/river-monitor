import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sensors").collect();
  },
});

export const getById = query({
  args: { id: v.id("sensors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getBySiteId = query({
  args: { siteId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sensors")
      .withIndex("by_site_id", (q) => q.eq("siteId", args.siteId))
      .unique();
  },
});

export const create = mutation({
  args: {
    siteId: v.string(),
    name: v.string(),
    basin: v.string(),
    lat: v.number(),
    lon: v.number(),
    level: v.union(v.number(), v.null()),
    battery: v.number(),
    signal: v.number(),
    status: v.string(),
    thresholds: v.object({
      normal: v.number(),
      warning: v.number(),
      danger: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sensors", {
      ...args,
      lastUpdated: Date.now(),
    });
  },
});

export const updateTelemetry = mutation({
  args: {
    id: v.id("sensors"),
    level: v.union(v.number(), v.null()),
    battery: v.number(),
    signal: v.number(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, {
      ...updates,
      lastUpdated: Date.now(),
    });
  },
});
