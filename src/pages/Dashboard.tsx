import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Database,
  Loader2,
  MapPin,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const getStatusColor = (status: string) => {
  switch (status) {
    case "Normal":
      return "bg-green-500";
    case "Warning":
      return "bg-orange-500";
    case "Danger":
      return "bg-red-500";
    case "Offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
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

const createCustomIcon = (status: string) => {
  const color = status === "Normal" ? "green" : status === "Warning" ? "orange" : status === "Danger" ? "red" : "gray";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function Dashboard() {
  const { isLoading: authLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const sensors = useQuery(api.sensors.list);
  const alerts = useQuery(api.alerts.list, {});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || !sensors || !alerts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalSensors = sensors.length;
  const onlineSensors = sensors.filter((s) => s.status !== "Offline").length;
  const activeAlerts = alerts.filter((a) => a.status === "Active").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Water Level Monitoring</h1>
                <p className="text-sm text-muted-foreground">Central Water Commission</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/alerts")}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alerts
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">{user?.name?.[0] || "U"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sensors
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSensors}</div>
              <p className="text-xs text-muted-foreground mt-1">Deployed across basins</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sensors Online
              </CardTitle>
              <Wifi className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{onlineSensors}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {((onlineSensors / totalSensors) * 100).toFixed(0)}% operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Alerts
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeAlerts}</div>
              <p className="text-xs text-muted-foreground mt-1">Requiring attention</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Map View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sensor Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] rounded-lg overflow-hidden border">
                <MapContainer
                  center={[20.5937, 78.9629]}
                  zoom={5}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {sensors.map((sensor) => (
                    <Marker
                      key={sensor._id}
                      position={[sensor.lat, sensor.lon]}
                      icon={createCustomIcon(sensor.status)}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{sensor.name}</h3>
                          <p className="text-sm text-muted-foreground">{sensor.basin} Basin</p>
                          <p className="text-sm mt-1">
                            Level: {sensor.level !== null ? `${sensor.level}m` : "N/A"}
                          </p>
                          <p className="text-sm">Status: {sensor.status}</p>
                          <Button
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => navigate(`/site/${sensor.siteId}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Site List Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>All Sensor Sites</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Site Name</TableHead>
                    <TableHead>River Basin</TableHead>
                    <TableHead>Water Level</TableHead>
                    <TableHead>Battery</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensors.map((sensor) => (
                    <TableRow
                      key={sensor._id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/site/${sensor.siteId}`)}
                    >
                      <TableCell className="font-medium">{sensor.name}</TableCell>
                      <TableCell>{sensor.basin}</TableCell>
                      <TableCell>
                        {sensor.level !== null ? `${sensor.level.toFixed(1)}m` : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {sensor.battery > 20 ? (
                            <Wifi className="h-4 w-4 text-green-500" />
                          ) : (
                            <WifiOff className="h-4 w-4 text-red-500" />
                          )}
                          {sensor.battery}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(sensor.status)}>
                          {sensor.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
