import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  Battery,
  Droplet,
  Loader2,
  MapPin,
  Signal,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "convex/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import GaugeChart from "react-gauge-chart";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Normal":
      return "text-green-500";
    case "Warning":
      return "text-orange-500";
    case "Danger":
      return "text-red-500";
    case "Offline":
      return "text-gray-400";
    default:
      return "text-gray-400";
  }
};

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    Normal: "default",
    Warning: "secondary",
    Danger: "destructive",
    Offline: "outline",
  };
  return variants[status] || "outline";
};

export default function SiteDetail() {
  const { siteId } = useParams<{ siteId: string }>();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState("24hr");

  const sensor = useQuery(api.sensors.getBySiteId, siteId ? { siteId } : "skip");
  const readings = useQuery(
    api.readings.getBySensorId,
    sensor?._id ? { sensorId: sensor._id, timeRange } : "skip"
  );

  if (sensor === undefined || readings === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sensor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Sensor Not Found</h2>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const gaugeValue = sensor.level
    ? Math.min(sensor.level / (sensor.thresholds.danger + 10), 1)
    : 0;

  const chartData = readings
    .map((r) => ({
      timestamp: new Date(r.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      level: r.level,
      fullTimestamp: r.timestamp,
    }))
    .reverse();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                  <Activity className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{sensor.name}</h1>
                  <p className="text-sm text-muted-foreground">{sensor.basin} Basin</p>
                </div>
              </div>
            </div>
            <Badge variant={getStatusBadge(sensor.status)} className="text-base px-4 py-2">
              {sensor.status}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Gauge and Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Water Level Gauge */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplet className="h-5 w-5" />
                    Current Water Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <GaugeChart
                      id="water-level-gauge"
                      nrOfLevels={3}
                      colors={["#22c55e", "#f97316", "#ef4444"]}
                      arcWidth={0.3}
                      percent={gaugeValue}
                      textColor="#000000"
                      needleColor="#475569"
                      needleBaseColor="#475569"
                    />
                    <div className="text-center mt-4">
                      <div className="text-4xl font-bold">
                        {sensor.level !== null ? `${sensor.level.toFixed(1)}m` : "N/A"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Last updated:{" "}
                        {new Date(sensor.lastUpdated).toLocaleString()}
                      </div>
                    </div>
                    <div className="w-full mt-6 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Normal:</span>
                        <span className="font-medium">
                          &lt; {sensor.thresholds.normal}m
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Warning:</span>
                        <span className="font-medium text-orange-500">
                          {sensor.thresholds.warning}m
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Danger:</span>
                        <span className="font-medium text-red-500">
                          {sensor.thresholds.danger}m
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sensor Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Sensor Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <div className="text-sm font-medium">
                      {sensor.lat.toFixed(4)}, {sensor.lon.toFixed(4)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Battery className="h-4 w-4" />
                      <span className="text-sm">Battery</span>
                    </div>
                    <div className="text-sm font-medium">{sensor.battery}%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Signal className="h-4 w-4" />
                      <span className="text-sm">Signal Strength</span>
                    </div>
                    <div className="text-sm font-medium">{sensor.signal}%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      <span className="text-sm">Site ID</span>
                    </div>
                    <div className="text-sm font-medium">{sensor.siteId}</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Historical Data */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Historical Water Level Data</CardTitle>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24hr">Last 24 Hours</SelectItem>
                      <SelectItem value="7day">Last 7 Days</SelectItem>
                      <SelectItem value="30day">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tick={{ fontSize: 12 }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        label={{
                          value: "Water Level (m)",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <ReferenceLine
                        y={sensor.thresholds.warning}
                        stroke="#f97316"
                        strokeDasharray="3 3"
                        label="Warning"
                      />
                      <ReferenceLine
                        y={sensor.thresholds.danger}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        label="Danger"
                      />
                      <Line
                        type="monotone"
                        dataKey="level"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
