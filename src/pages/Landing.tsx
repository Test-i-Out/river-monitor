import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Droplet,
  MapPin,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">CWC Monitor</h1>
                <p className="text-xs text-muted-foreground">Water Level Monitoring</p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
            >
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="h-4 w-4" />
            Central Water Commission
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Real-time Water Level
            <br />
            <span className="text-primary">Monitoring System</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Monitor water levels across India's major river basins with real-time IoT
            sensors, intelligent alerts, and comprehensive data analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8"
            >
              Go to Dashboard
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Monitoring Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Interactive Maps</h3>
                <p className="text-muted-foreground">
                  Visualize all sensor locations on an interactive map with real-time
                  status indicators and detailed site information.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Alerts</h3>
                <p className="text-muted-foreground">
                  Receive instant notifications when water levels exceed warning or danger
                  thresholds with intelligent alert management.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Historical Analytics</h3>
                <p className="text-muted-foreground">
                  Access comprehensive historical data with interactive charts and
                  customizable time ranges for trend analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary text-primary-foreground rounded-2xl p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <Droplet className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Real-time Monitoring</div>
            </div>
            <div>
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-lg opacity-90">Sensor Locations</div>
            </div>
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-lg opacity-90">System Uptime</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Monitor Water Levels?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the Central Water Commission's comprehensive monitoring network and
            access real-time data from sensors across India.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="text-lg px-8"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">CWC Monitor</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Central Water Commission. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}