declare module 'react-gauge-chart' {
  import { FC } from 'react';

  interface GaugeChartProps {
    id: string;
    nrOfLevels?: number;
    colors?: string[];
    arcWidth?: number;
    percent?: number;
    textColor?: string;
    needleColor?: string;
    needleBaseColor?: string;
    hideText?: boolean;
    animate?: boolean;
    animDelay?: number;
  }

  const GaugeChart: FC<GaugeChartProps>;
  export default GaugeChart;
}
