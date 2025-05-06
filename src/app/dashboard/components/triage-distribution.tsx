"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Triaged } from "@/app/api/dashboard/apiService";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

interface TriageDistributionProps {
  triaged: Triaged[];
  loading: boolean;
}

export default function TriageDistribution({
  triaged,
  loading,
}: TriageDistributionProps) {
  // Calculate CTAS level distribution
  const calculateCtasDistribution = () => {
    const levels = {
      "Level 1 (Resuscitation)": 0,
      "Level 2 (Emergent)": 0,
      "Level 3 (Urgent)": 0,
      "Level 4 (Less Urgent)": 0,
      "Level 5 (Non-Urgent)": 0,
    };

    triaged.forEach((t) => {
      switch (t.assigned_lvl) {
        case 1:
          levels["Level 1 (Resuscitation)"]++;
          break;
        case 2:
          levels["Level 2 (Emergent)"]++;
          break;
        case 3:
          levels["Level 3 (Urgent)"]++;
          break;
        case 4:
          levels["Level 4 (Less Urgent)"]++;
          break;
        case 5:
          levels["Level 5 (Non-Urgent)"]++;
          break;
      }
    });

    return Object.entries(levels).map(([name, value]) => ({
      name,
      value,
    }));
  };

  // Generate triage volume by time of day data
  const generateTriageVolumeByTime = () => {
    // For demo purposes, create a 24-hour distribution with some realistic patterns
    // Real implementation would use actual timestamps from triage data
    return [
      {
        hour: "00:00",
        volume: 5,
        level1: 1,
        level2: 1,
        level3: 2,
        level4: 1,
        level5: 0,
      },
      {
        hour: "01:00",
        volume: 3,
        level1: 0,
        level2: 1,
        level3: 1,
        level4: 1,
        level5: 0,
      },
      {
        hour: "02:00",
        volume: 2,
        level1: 0,
        level2: 0,
        level3: 1,
        level4: 1,
        level5: 0,
      },
      {
        hour: "03:00",
        volume: 2,
        level1: 0,
        level2: 0,
        level3: 1,
        level4: 0,
        level5: 1,
      },
      {
        hour: "04:00",
        volume: 1,
        level1: 0,
        level2: 0,
        level3: 0,
        level4: 1,
        level5: 0,
      },
      {
        hour: "05:00",
        volume: 2,
        level1: 0,
        level2: 0,
        level3: 1,
        level4: 1,
        level5: 0,
      },
      {
        hour: "06:00",
        volume: 3,
        level1: 0,
        level2: 1,
        level3: 1,
        level4: 1,
        level5: 0,
      },
      {
        hour: "07:00",
        volume: 5,
        level1: 0,
        level2: 1,
        level3: 2,
        level4: 1,
        level5: 1,
      },
      {
        hour: "08:00",
        volume: 8,
        level1: 1,
        level2: 2,
        level3: 3,
        level4: 1,
        level5: 1,
      },
      {
        hour: "09:00",
        volume: 12,
        level1: 1,
        level2: 3,
        level3: 4,
        level4: 3,
        level5: 1,
      },
      {
        hour: "10:00",
        volume: 15,
        level1: 2,
        level2: 3,
        level3: 5,
        level4: 3,
        level5: 2,
      },
      {
        hour: "11:00",
        volume: 18,
        level1: 2,
        level2: 4,
        level3: 6,
        level4: 4,
        level5: 2,
      },
      {
        hour: "12:00",
        volume: 20,
        level1: 2,
        level2: 5,
        level3: 7,
        level4: 4,
        level5: 2,
      },
      {
        hour: "13:00",
        volume: 17,
        level1: 2,
        level2: 4,
        level3: 6,
        level4: 3,
        level5: 2,
      },
      {
        hour: "14:00",
        volume: 15,
        level1: 1,
        level2: 4,
        level3: 5,
        level4: 3,
        level5: 2,
      },
      {
        hour: "15:00",
        volume: 14,
        level1: 1,
        level2: 3,
        level3: 5,
        level4: 3,
        level5: 2,
      },
      {
        hour: "16:00",
        volume: 16,
        level1: 2,
        level2: 4,
        level3: 5,
        level4: 3,
        level5: 2,
      },
      {
        hour: "17:00",
        volume: 19,
        level1: 2,
        level2: 5,
        level3: 6,
        level4: 4,
        level5: 2,
      },
      {
        hour: "18:00",
        volume: 22,
        level1: 3,
        level2: 5,
        level3: 7,
        level4: 5,
        level5: 2,
      },
      {
        hour: "19:00",
        volume: 18,
        level1: 2,
        level2: 4,
        level3: 6,
        level4: 4,
        level5: 2,
      },
      {
        hour: "20:00",
        volume: 14,
        level1: 1,
        level2: 3,
        level3: 5,
        level4: 3,
        level5: 2,
      },
      {
        hour: "21:00",
        volume: 12,
        level1: 1,
        level2: 3,
        level3: 4,
        level4: 3,
        level5: 1,
      },
      {
        hour: "22:00",
        volume: 9,
        level1: 1,
        level2: 2,
        level3: 3,
        level4: 2,
        level5: 1,
      },
      {
        hour: "23:00",
        volume: 7,
        level1: 1,
        level2: 1,
        level3: 3,
        level4: 1,
        level5: 1,
      },
    ];
  };

  const ctasData = calculateCtasDistribution();
  const timeData = generateTriageVolumeByTime();

  // CTAS colors
  const COLORS = [
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#008000",
    "#0000FF",
  ];

  // Chart config for the time-based chart
  const chartConfig = {
    volume: {
      label: "Total Volume",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>CTAS Level Distribution</CardTitle>
          <CardDescription>
            Breakdown of patients by triage level
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {loading ? (
            <Skeleton className="h-[300px] w-[300px] rounded-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ctasData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ctasData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Triage Volume by Time of Day</CardTitle>
          <CardDescription>
            Hourly distribution of patient arrivals
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ChartContainer
              config={chartConfig}
              className="h-[300px]"
            >
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient
                    id="colorVolume"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="hour"
                  tickFormatter={(value) => value.split(":")[0]}
                  ticks={[
                    "00:00",
                    "06:00",
                    "12:00",
                    "18:00",
                    "23:00",
                  ]}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorVolume)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Triage Level Descriptions</CardTitle>
          <CardDescription>
            Canadian Triage and Acuity Scale (CTAS) levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-red-100 border border-red-500">
              <h3 className="font-bold text-red-700">Level 1</h3>
              <p className="text-sm">
                Resuscitation - Immediate life-threatening conditions
              </p>
            </div>
            <div className="p-4 rounded-lg bg-orange-100 border border-orange-500">
              <h3 className="font-bold text-orange-700">Level 2</h3>
              <p className="text-sm">
                Emergent - Conditions that are a potential threat to
                life or limb
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-100 border border-yellow-500">
              <h3 className="font-bold text-yellow-700">Level 3</h3>
              <p className="text-sm">
                Urgent - Conditions that could potentially progress to
                a serious problem
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-100 border border-green-500">
              <h3 className="font-bold text-green-700">Level 4</h3>
              <p className="text-sm">
                Less Urgent - Conditions related to patient age,
                distress, or potential for deterioration
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-100 border border-blue-500">
              <h3 className="font-bold text-blue-700">Level 5</h3>
              <p className="text-sm">
                Non-Urgent - Conditions that may be acute but
                non-urgent or part of a chronic problem
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
