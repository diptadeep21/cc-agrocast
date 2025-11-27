import { useMemo } from 'react';
import { motion } from 'framer-motion';

const DisasterAlerts = ({ forecastData, currentWeather }) => {
	const alerts = useMemo(() => {
		if (!forecastData?.list) return [];

		const alertList = [];
		const dailyData = {};

		// Group forecast by day
		forecastData.list.forEach((item) => {
			const date = new Date(item.dt * 1000).toDateString();
			if (!dailyData[date]) {
				dailyData[date] = {
					maxTemp: item.main.temp_max - 273.15,
					minTemp: item.main.temp_min - 273.15,
					windSpeed: item.wind?.speed || 0,
					pop: item.pop,
					rain: item.rain?.['3h'] || 0,
					date: date,
				};
			} else {
				dailyData[date].maxTemp = Math.max(
					dailyData[date].maxTemp,
					item.main.temp_max - 273.15
				);
				dailyData[date].minTemp = Math.min(
					dailyData[date].minTemp,
					item.main.temp_min - 273.15
				);
				dailyData[date].windSpeed = Math.max(
					dailyData[date].windSpeed,
					item.wind?.speed || 0
				);
				dailyData[date].pop = Math.max(dailyData[date].pop, item.pop);
				dailyData[date].rain += item.rain?.['3h'] || 0;
			}
		});

		const days = Object.values(dailyData);

		// Check for alerts
		days.forEach((day, idx) => {
			// Heavy rain alert
			if (day.pop >= 0.7 && day.rain > 10) {
				alertList.push({
					type: 'critical',
					severity: 'Critical',
					date: day.date,
					title: 'Heavy Rain Alert',
					message:
						'Heavy rainfall expected. Risk of flooding and waterlogging. Postpone pesticide spraying and protect vulnerable crops.',
					action: 'Move vulnerable livestock, delay fertilization',
				});
			}

			// Storm/High wind
			if (day.windSpeed > 15) {
				alertList.push({
					type: 'critical',
					severity: 'Critical',
					date: day.date,
					title: 'High Wind/Storm Alert',
					message: `Wind speed expected to reach ${day.windSpeed.toFixed(1)} m/s.`,
					action: 'Secure farm structures, protect crops from wind damage',
				});
			}

			// Heatwave (check consecutive days)
			if (day.maxTemp > 40) {
				const nextDay = days[idx + 1];
				if (nextDay && nextDay.maxTemp > 40) {
					alertList.push({
						type: 'warning',
						severity: 'Warning',
						date: day.date,
						title: 'Heatwave Alert',
						message:
							'Temperatures exceeding 40°C for multiple days. High risk of crop stress.',
						action: 'Increase irrigation frequency, provide shade for sensitive crops',
					});
				}
			}

			// Frost
			if (day.minTemp < 0) {
				alertList.push({
					type: 'critical',
					severity: 'Critical',
					date: day.date,
					title: 'Frost Alert',
					message: `Minimum temperature expected to drop to ${day.minTemp.toFixed(1)}°C.`,
					action: 'Cover seedlings, move sensitive plants indoors, protect irrigation systems',
				});
			}
		});

		return alertList;
	}, [forecastData]);

	if (alerts.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
			>
				<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
					Disaster Alerts
				</h3>
				<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
					<p className="text-green-800 dark:text-green-300">
						✅ No active alerts. Weather conditions are favorable.
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
		>
			<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				Disaster Alerts
			</h3>
			<div className="space-y-4">
				{alerts.map((alert, idx) => (
					<div
						key={idx}
						className={`p-4 rounded-lg border ${
							alert.type === 'critical'
								? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
								: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800'
						}`}
					>
						<div className="flex justify-between items-start mb-2">
							<div>
								<span
									className={`px-2 py-1 text-xs font-semibold rounded ${
										alert.type === 'critical'
											? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
											: 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
									}`}
								>
									{alert.severity}
								</span>
								<h4 className="font-bold text-gray-800 dark:text-gray-200 mt-2">
									{alert.title}
								</h4>
							</div>
							<span className="text-xs text-gray-500 dark:text-gray-400">
								{new Date(alert.date).toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								})}
							</span>
						</div>
						<p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
							{alert.message}
						</p>
						<p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
							💡 Action: {alert.action}
						</p>
					</div>
				))}
			</div>
		</motion.div>
	);
};

export default DisasterAlerts;

