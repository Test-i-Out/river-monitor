import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBySensorId = query({
  args: {
    sensorId: v.id("sensors"),
    timeRange: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let startTime = now - 24 * 60 * 60 * 1000; // Default: 24 hours

    if (args.timeRange === "7day") {
      startTime = now - 7 * 24 * 60 * 60 * 1000;
    } else if (args.timeRange === "30day") {
      startTime = now - 30 * 24 * 60 * 60 * 1000;
    }

    return await ctx.db
      .query("readings")
      .withIndex("by_sensor_and_time", (q) =>
        q.eq("sensorId", args.sensorId).gt("timestamp", startTime)
      )
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    sensorId: v.id("sensors"),
    level: v.number(),
    battery: v.number(),
    signal: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("readings", {
      ...args,
      timestamp: Date.now(),
    });
  },
});
