import { useMemo } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Area,
	AreaChart,
} from 'recharts';
import { motion } from 'framer-motion';

const TrendChart = ({ forecastData }) => {
	const chartData = useMemo(() => {
		if (!forecastData?.list) return [];

		return forecastData.list.slice(0, 7).map((item) => {
			const date = new Date(item.dt * 1000);
			const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
			const temp = (item.main.temp - 273.15).toFixed(1);
			const pop = (item.pop * 100).toFixed(0);
			const rain = item.rain?.['3h'] || 0;

			return {
				day: dayName,
				date: date.toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
				}),
				temperature: parseFloat(temp),
				precipitation: parseFloat(pop),
				rainfall: rain,
			};
		});
	}, [forecastData]);

	if (chartData.length === 0) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
				<p className="text-gray-500">No forecast data available</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
		>
			<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				7-Day Temperature & Precipitation Forecast
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart data={chartData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="day"
						tick={{ fill: '#6b7280' }}
						style={{ fontSize: '12px' }}
					/>
					<YAxis
						yAxisId="left"
						label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
						tick={{ fill: '#6b7280' }}
					/>
					<YAxis
						yAxisId="right"
						orientation="right"
						label={{
							value: 'Precipitation (%)',
							angle: 90,
							position: 'insideRight',
						}}
						tick={{ fill: '#6b7280' }}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: '#1f2937',
							border: 'none',
							borderRadius: '8px',
							color: '#fff',
						}}
					/>
					<Legend />
					<Area
						type="monotone"
						dataKey="temperature"
						stroke="#1f8a4d"
						fill="#1f8a4d"
						fillOpacity={0.3}
						yAxisId="left"
						name="Temperature (°C)"
					/>
					<Line
						type="monotone"
						dataKey="precipitation"
						stroke="#1e90ff"
						strokeWidth={2}
						yAxisId="right"
						name="Precipitation (%)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</motion.div>
	);
};

export default TrendChart;

