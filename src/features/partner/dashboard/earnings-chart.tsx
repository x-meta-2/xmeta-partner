import { Card } from '#/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartPoint } from '#/services';

const chartConfig = {
  amount: {
    label: 'Commission',
    color: 'var(--color-primary)',
  },
} satisfies ChartConfig;

export function EarningsChart({ data }: { data: ChartPoint[] }) {
  return (
    <Card className="gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-base font-medium">Commission (Last 30 days)</div>
          <div className="text-xs text-muted-foreground">
            Daily commission earned
          </div>
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[240px] w-full">
        <AreaChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="earnings-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(v: number) => `$${v}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="amount"
            type="monotone"
            fill="url(#earnings-fill)"
            stroke="var(--color-amount)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </Card>
  );
}
