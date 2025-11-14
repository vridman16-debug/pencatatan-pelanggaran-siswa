import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ViolationRecord } from '../types';

interface ViolationChartProps {
    data: ViolationRecord[];
}

const COLORS = ['#4f46e5', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
const MAX_STUDENTS_SHOWN = 6;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
        <p className="font-bold text-gray-900 dark:text-gray-100">{`${payload[0].name}`}</p>
        <p className="text-sm text-indigo-600 dark:text-indigo-400">{`Total Pelanggaran: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};


const ViolationChart: React.FC<ViolationChartProps> = ({ data }) => {
    const chartData = useMemo(() => {
        const studentCounts: { [key: string]: number } = {};

        data.forEach(record => {
            studentCounts[record.studentName] = (studentCounts[record.studentName] || 0) + record.violations.length;
        });
        
        const sortedStudents = Object.entries(studentCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        if (sortedStudents.length > MAX_STUDENTS_SHOWN) {
            const topStudents = sortedStudents.slice(0, MAX_STUDENTS_SHOWN);
            const othersValue = sortedStudents.slice(MAX_STUDENTS_SHOWN).reduce((acc, curr) => acc + curr.value, 0);
            return [...topStudents, { name: 'Lainnya', value: othersValue }];
        }

        return sortedStudents;

    }, [data]);

    if (data.length === 0) {
        return (
            <div style={{ width: '100%', height: 300 }} className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                <p>Belum ada data untuk ditampilkan di diagram.</p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ViolationChart;