import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import healthRules from '@/data/healthRules.json';

const HealthAQI = ({ lat, lon }) => {
	const [aqiData, setAqiData] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!lat || !lon) return;

		const fetchAQI = async () => {
			setLoading(true);
			setError(null);

			try {
				const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || process.env.REACT_APP_OPENWEATHER_KEY;
				if (!apiKey) {
					setError('API key not configured');
					setLoading(false);
					return;
				}

				const response = await fetch(
					`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
				);

				if (!response.ok) {
					const text = await response.text();
					if (text.trim().startsWith('<')) {
						throw new Error('Unexpected HTML response from server');
					}
					throw new Error(`HTTP ${response.status}: ${text}`);
				}

				const data = await response.json();
				setAqiData(data);
			} catch (err) {
				setError(err.message || 'Failed to fetch AQI data');
			} finally {
				setLoading(false);
			}
		};

		fetchAQI();
	}, [lat, lon]);

	const getAQICategory = (aqi) => {
		return healthRules[aqi.toString()] || healthRules['3'];
	};

	const getAQIColor = (aqi) => {
		switch (aqi) {
			case 1:
				return 'bg-green-500';
			case 2:
				return 'bg-yellow-500';
			case 3:
				return 'bg-orange-500';
			case 4:
				return 'bg-red-500';
			case 5:
				return 'bg-purple-500';
			default:
				return 'bg-gray-500';
		}
	};

	if (loading) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
			>
				<p className="text-gray-500">Loading AQI data...</p>
			</motion.div>
		);
	}

	if (error) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
			>
				<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
					Health & Air Quality
				</h3>
				<div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
					<p className="text-red-800 dark:text-red-300 text-sm">{error}</p>
				</div>
			</motion.div>
		);
	}

	if (!aqiData) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
			>
				<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
					Health & Air Quality
				</h3>
				<p className="text-gray-500">No AQI data available</p>
			</motion.div>
		);
	}

	const aqi = aqiData.list?.[0]?.main?.aqi || 3;
	const components = aqiData.list?.[0]?.components || {};
	const category = getAQICategory(aqi);

	const mainPollutant = Object.entries(components).reduce((a, b) =>
		components[a[0]] > components[b[0]] ? a : b
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
		>
			<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				Health & Air Quality
			</h3>

			<div className="mb-4">
				<div className="flex items-center gap-4 mb-4">
					<div
						className={`w-16 h-16 rounded-full ${getAQIColor(
							aqi
						)} flex items-center justify-center text-white font-bold text-2xl`}
					>
						{aqi}
					</div>
					<div>
						<p className="text-sm text-gray-500 dark:text-gray-400">Air Quality Index</p>
						<p className="text-xl font-bold text-gray-800 dark:text-gray-200">
							{category.category}
						</p>
					</div>
				</div>

				<div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
					<p className="text-sm text-gray-700 dark:text-gray-300">
						{category.recommendation}
					</p>
				</div>

				{mainPollutant && (
					<div className="mt-4">
						<p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
							Main Pollutant:
						</p>
						<p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
							{mainPollutant[0].replace(/_/g, ' ')}: {mainPollutant[1].toFixed(2)} μg/m³
						</p>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default HealthAQI;

