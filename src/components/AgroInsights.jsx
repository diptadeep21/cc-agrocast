import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import cropData from '@/data/cropData.json';

const AgroInsights = ({ forecastData, currentWeather }) => {
	const [selectedCrop, setSelectedCrop] = useState('');
	const [advice, setAdvice] = useState(null);

	const getAdvice = () => {
		if (!selectedCrop || !forecastData || !currentWeather) {
			setAdvice(null);
			return;
		}

		const crop = cropData.find((c) => c.crop === selectedCrop);
		if (!crop) {
			setAdvice({ type: 'error', message: 'Crop not found' });
			return;
		}

		const recommendations = [];
		const currentTemp = currentWeather.main?.temp
			? currentWeather.main.temp - 273.15
			: null;

		// Check temperature range
		if (currentTemp !== null) {
			if (currentTemp < crop.sowingTemperatureRange[0]) {
				recommendations.push({
					type: 'warning',
					message: `Temperature (${currentTemp.toFixed(1)}°C) is below optimal sowing range (${crop.sowingTemperatureRange[0]}-${crop.sowingTemperatureRange[1]}°C). Consider delaying sowing.`,
				});
			} else if (currentTemp > crop.sowingTemperatureRange[1]) {
				recommendations.push({
					type: 'warning',
					message: `Temperature (${currentTemp.toFixed(1)}°C) is above optimal sowing range. Ensure adequate irrigation.`,
				});
			} else {
				recommendations.push({
					type: 'success',
					message: `Temperature is within optimal range for ${crop.crop} sowing.`,
				});
			}
		}

		// Check forecast for rain
		if (forecastData.list) {
			const next3Days = forecastData.list.slice(0, 8); // ~3 days
			const heavyRainDays = next3Days.filter(
				(item) => item.pop >= 0.7 && (item.rain?.['3h'] || 0) > 10
			);

			if (heavyRainDays.length > 0 && crop.rainTolerance === 'low') {
				recommendations.push({
					type: 'critical',
					message: `Heavy rain forecasted. ${crop.crop} has low rain tolerance. Delay fertilization and protect crops.`,
				});
			} else if (heavyRainDays.length > 0 && crop.rainTolerance === 'medium') {
				recommendations.push({
					type: 'warning',
					message: `Moderate to heavy rain expected. Monitor ${crop.crop} fields closely.`,
				});
			}
		}

		// Add crop-specific notes
		if (crop.notes) {
			recommendations.push({
				type: 'info',
				message: crop.notes,
			});
		}

		setAdvice({
			crop: crop.crop,
			recommendations,
		});
	};

	const getTypeColor = (type) => {
		switch (type) {
			case 'success':
				return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-400';
			case 'warning':
				return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-400';
			case 'critical':
				return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-400';
			default:
				return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-400';
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
		>
			<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
				Agricultural Insights
			</h3>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Select Crop:
				</label>
				<select
					value={selectedCrop}
					onChange={(e) => setSelectedCrop(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--agro-green)] dark:bg-gray-700 dark:text-white"
				>
					<option value="">Choose a crop...</option>
					{cropData.map((crop) => (
						<option key={crop.crop} value={crop.crop}>
							{crop.crop}
						</option>
					))}
				</select>
			</div>

			<button
				onClick={getAdvice}
				disabled={!selectedCrop}
				className="w-full px-4 py-2 bg-[var(--agro-green)] text-white rounded-lg hover:bg-[var(--agro-green-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
			>
				Get Advice
			</button>

			{advice && (
				<div className="space-y-3">
					<h4 className="font-semibold text-gray-800 dark:text-gray-200">
						Recommendations for {advice.crop}:
					</h4>
					{advice.recommendations.map((rec, idx) => (
						<div
							key={idx}
							className={`p-3 rounded-lg border ${getTypeColor(rec.type)}`}
						>
							<p className="text-sm">{rec.message}</p>
						</div>
					))}
				</div>
			)}
		</motion.div>
	);
};

export default AgroInsights;

