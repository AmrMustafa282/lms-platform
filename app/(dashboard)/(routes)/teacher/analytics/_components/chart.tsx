"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
 ChartConfig,
 ChartContainer,
 ChartTooltip,
 ChartTooltipContent,
} from "@/components/ui/chart";
import { formatPrice } from "@/lib/format";

export function Chart({
 chartData,
 chartConfig,
}: {
 chartData: any;
 chartConfig: ChartConfig;
}) {
 return (
  <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
   <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
     dataKey="name"
     tickLine={false}
     tickMargin={10}
     axisLine={false}
    //  tickFormatter={(value) => value.slice(0, 3)}
    />
    <YAxis
     tickLine={false}
     tickMargin={10}
     axisLine={false}
     tickFormatter={(value) => formatPrice(value)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar
     dataKey="total"
     fill="var(--color-desktop)"
     radius={4}
     maxBarSize={100}
    />
   </BarChart>
  </ChartContainer>
 );
}
