import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Create sensors
    const sensor1 = await ctx.db.insert("sensors", {
      siteId: "CWC-001",
      name: "Krishna Bridge",
      basin: "Krishna",
      lat: 17.3,
      lon: 78.5,
      level: 34.5,
      battery: 88,
      signal: 92,
      status: "Normal",
      lastUpdated: Date.now(),
      thresholds: { normal: 40.0, warning: 45.0, danger: 50.0 },
    });

    const sensor2 = await ctx.db.insert("sensors", {
      siteId: "CWC-002",
      name: "Mettur Dam",
      basin: "Cauvery",
      lat: 11.7,
      lon: 77.8,
      level: 48.2,
      battery: 76,
      signal: 85,
      status: "Warning",
      lastUpdated: Date.now(),
      thresholds: { normal: 45.0, warning: 48.0, danger: 50.0 },
    });

    const sensor3 = await ctx.db.insert("sensors", {
      siteId: "CWC-003",
      name: "Godavari Point",
      basin: "Godavari",
      lat: 16.9,
      lon: 81.7,
      level: 55.1,
      battery: 92,
      signal: 88,
      status: "Danger",
      lastUpdated: Date.now(),
      thresholds: { normal: 45.0, warning: 50.0, danger: 52.0 },
    });

    const sensor4 = await ctx.db.insert("sensors", {
      siteId: "CWC-004",
      name: "Yamuna Barrage",
      basin: "Yamuna",
      lat: 28.6,
      lon: 77.2,
      level: null,
      battery: 0,
      signal: 0,
      status: "Offline",
      lastUpdated: Date.now() - 3600000,
      thresholds: { normal: 40.0, warning: 45.0, danger: 48.0 },
    });

    // Create historical readings
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      await ctx.db.insert("readings", {
        sensorId: sensor1,
        level: 34.0 + Math.random() * 2,
        battery: 88 - i * 0.1,
        signal: 90 + Math.random() * 5,
        timestamp: now - i * 3600000,
      });

      await ctx.db.insert("readings", {
        sensorId: sensor2,
        level: 47.0 + Math.random() * 2,
        battery: 76 - i * 0.1,
        signal: 83 + Math.random() * 5,
        timestamp: now - i * 3600000,
      });

      await ctx.db.insert("readings", {
        sensorId: sensor3,
        level: 54.0 + Math.random() * 2,
        battery: 92 - i * 0.05,
        signal: 86 + Math.random() * 4,
        timestamp: now - i * 3600000,
      });
    }

    // Create alerts
    await ctx.db.insert("alerts", {
      sensorId: sensor2,
      siteName: "Mettur Dam",
      severity: "Warning",
      level: 48.2,
      message: "Water level approaching warning threshold",
      status: "Active",
      timestamp: now - 1800000,
    });

    await ctx.db.insert("alerts", {
      sensorId: sensor3,
      siteName: "Godavari Point",
      severity: "Danger",
      level: 55.1,
      message: "Water level exceeded danger threshold",
      status: "Active",
      timestamp: now - 900000,
    });

    await ctx.db.insert("alerts", {
      sensorId: sensor4,
      siteName: "Yamuna Barrage",
      severity: "Warning",
      level: 0,
      message: "Sensor offline - no data received",
      status: "Active",
      timestamp: now - 3600000,
    });

    return { success: true, message: "Sample data created successfully" };
  },
});
