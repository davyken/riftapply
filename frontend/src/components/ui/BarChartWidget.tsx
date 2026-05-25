'use client';
import dynamic from 'next/dynamic';

interface Props {
  data: { month: string; value: number }[];
  color?: string;
}

const Chart = dynamic(
  () =>
    import('recharts').then((mod) => {
      const { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } = mod;
      function BarChartWidget({ data, color = '#1a3a6b' }: Props) {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={18}>
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9ca3af' }}
              />
              <Tooltip
                contentStyle={{
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 12,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
                cursor={{ fill: 'rgba(26,58,107,0.05)' }}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      }
      return BarChartWidget;
    }),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-end justify-around gap-1 pb-6">
        {[22,38,45,60,78,95].map((h, i) => (
          <div key={i} className="flex-1 bg-gray-100 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
  }
);

export default function BarChartWidget({ data, color }: Props) {
  return <Chart data={data} color={color} />;
}
