import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    status: v.optional(v.string()),
    severity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let alerts;

    if (args.status !== undefined) {
      const status = args.status;
      alerts = await ctx.db
        .query("alerts")
        .withIndex("by_status", (q) => q.eq("status", status))
        .order("desc")
        .collect();
    } else {
      alerts = await ctx.db.query("alerts").order("desc").collect();
    }

    if (args.severity) {
      return alerts.filter((alert) => alert.severity === args.severity);
    }

    return alerts;
  },
});

export const create = mutation({
  args: {
    sensorId: v.id("sensors"),
    siteName: v.string(),
    severity: v.string(),
    level: v.number(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      ...args,
      status: "Active",
      timestamp: Date.now(),
    });
  },
});

export const acknowledge = mutation({
  args: { id: v.id("alerts") },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      status: "Acknowledged",
      acknowledgedAt: Date.now(),
    });
  },
});
