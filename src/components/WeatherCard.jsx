import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const WeatherCard = ({ currentWeather, cityName }) => {
	const [formattedTime, setFormattedTime] = useState('');
	const [sunrise, setSunrise] = useState('');
	const [sunset, setSunset] = useState('');

	useEffect(() => {
		if (!currentWeather) {
			console.error('Weather data is missing.');
			return;
		}

		const formatTime = (timestamp) => {
			try {
				const date = new Date(timestamp * 1000);
				return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			} catch (error) {
				console.error('Error formatting time:', error);
				return 'Invalid Time';
			}
		};

		try {
			if (currentWeather.dt) {
				setFormattedTime(formatTime(currentWeather.dt));
			}

			if (currentWeather.sys?.sunrise) {
				setSunrise(formatTime(currentWeather.sys.sunrise));
			}
			if (currentWeather.sys?.sunset) {
				setSunset(formatTime(currentWeather.sys.sunset));
			}
		} catch (error) {
			console.error('Error processing weather data:', error);
		}
	}, [currentWeather]);

	if (!currentWeather) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
				<p className="text-gray-500">No weather data available</p>
			</div>
		);
	}

	const temp = currentWeather.main?.temp
		? (currentWeather.main.temp - 273.15).toFixed(1)
		: 'N/A';
	const feelsLike = currentWeather.main?.feels_like
		? (currentWeather.main.feels_like - 273.15).toFixed(1)
		: 'N/A';
	const humidity = currentWeather.main?.humidity || 'N/A';
	const windSpeed = currentWeather.wind?.speed
		? (currentWeather.wind.speed * 3.6).toFixed(2)
		: 'N/A';
	const pressure = currentWeather.main?.pressure || 'N/A';
	const description =
		currentWeather.weather?.[0]?.description || 'Clear sky';
	const icon = currentWeather.weather?.[0]?.icon || '01d';

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
		>
			<div className="flex justify-between items-start mb-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
						{cityName || 'Unknown'}
					</h2>
					<p className="text-gray-500 dark:text-gray-400 text-sm">
						{formattedTime}
					</p>
				</div>
				{icon && (
					<Image
						src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
						alt={description}
						width={80}
						height={80}
					/>
				)}
			</div>

			<div className="mb-4">
				<div className="flex items-baseline gap-2">
					<span className="text-5xl font-bold text-gray-800 dark:text-gray-200">
						{temp}°C
					</span>
					<span className="text-gray-500 dark:text-gray-400">
						Feels like {feelsLike}°C
					</span>
				</div>
				<p className="text-lg text-gray-600 dark:text-gray-300 capitalize mt-2">
					{description}
				</p>
			</div>

			<div className="grid grid-cols-2 gap-4 mt-6">
				<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
					<p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
					<p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
						{humidity}%
					</p>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
					<p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
					<p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
						{windSpeed} km/h
					</p>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
					<p className="text-sm text-gray-500 dark:text-gray-400">Pressure</p>
					<p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
						{pressure} hPa
					</p>
				</div>
				<div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
					<p className="text-sm text-gray-500 dark:text-gray-400">Visibility</p>
					<p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
						{currentWeather.visibility
							? (currentWeather.visibility / 1000).toFixed(1)
							: 'N/A'}{' '}
						km
					</p>
				</div>
			</div>

			{(sunrise || sunset) && (
				<div className="flex justify-around mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
					<div className="text-center">
						<p className="text-sm text-gray-500 dark:text-gray-400">Sunrise</p>
						<p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
							{sunrise}
						</p>
					</div>
					<div className="text-center">
						<p className="text-sm text-gray-500 dark:text-gray-400">Sunset</p>
						<p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
							{sunset}
						</p>
					</div>
				</div>
			)}
		</motion.div>
	);
};

export default WeatherCard;

