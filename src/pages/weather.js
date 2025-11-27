import { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import { WeatherDataContext } from '@/utils/WeatherDataReducer';
import { fetchWeatherData } from '@/utils/FetchWeatherData';
import CitySearch from '@/components/CitySearch';
import WeatherCard from '@/components/WeatherCard';
import TrendChart from '@/components/TrendChart';
import MapView from '@/components/MapView';
import AgroInsights from '@/components/AgroInsights';
import DisasterAlerts from '@/components/DisasterAlerts';
import HealthAQI from '@/components/HealthAQI';
import SavedCities from '@/components/SavedCities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function WeatherPage() {
	const { state, dispatch } = useContext(WeatherDataContext);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [savedCities, setSavedCities] = useState([]);
	const [activeTab, setActiveTab] = useState('agro');

	useEffect(() => {
		loadSavedCities();
		// Load initial data from localStorage if available
		if (state.data && Object.keys(state.data).length > 0) {
			setError(null);
		}
	}, []);

	const loadSavedCities = () => {
		try {
			const saved = localStorage.getItem('agrocast.savedCities');
			if (saved) {
				setSavedCities(JSON.parse(saved));
			}
		} catch (error) {
			console.error('Error loading saved cities:', error);
		}
	};

	const handleSearch = async (query, signal) => {
		setLoading(true);
		setError(null);
		dispatch({ type: 'SET_ERROR', error: '' });

		try {
			const result = await fetchWeatherData({
				searchQuery: query,
				signal,
			});

			dispatch({ type: 'WEATHER_DATA', weatherData: result.data });
			dispatch({ type: 'FORECAST_DATA', forecastData: result.forecastData });
			dispatch({ type: 'SET_TIMEZONE', timezone: result.timezone });
			dispatch({ type: 'ADD_CURRENT_LOCATION', currentLocation: result.cityName });

			loadSavedCities();
		} catch (err) {
			if (err.name !== 'AbortError') {
				const errorMsg = err.message || 'Failed to fetch weather data';
				setError(errorMsg);
				dispatch({ type: 'SET_ERROR', error: errorMsg });
			}
		} finally {
			setLoading(false);
		}
	};

	const handleSelectCity = async (city) => {
		setLoading(true);
		setError(null);
		dispatch({ type: 'SET_ERROR', error: '' });

		try {
			const result = await fetchWeatherData({
				lat: city.lat,
				long: city.lon,
			});

			dispatch({ type: 'WEATHER_DATA', weatherData: result.data });
			dispatch({ type: 'FORECAST_DATA', forecastData: result.forecastData });
			dispatch({ type: 'SET_TIMEZONE', timezone: result.timezone });
			dispatch({ type: 'ADD_CURRENT_LOCATION', currentLocation: result.cityName });
		} catch (err) {
			const errorMsg = err.message || 'Failed to fetch weather data';
			setError(errorMsg);
			dispatch({ type: 'SET_ERROR', error: errorMsg });
		} finally {
			setLoading(false);
		}
	};

	const lat = state.data?.coord?.lat;
	const lon = state.data?.coord?.lon;
	const cityName = state.data?.name || state.currentLocation;
	const temperature = state.data?.main?.temp
		? (state.data.main.temp - 273.15).toFixed(1)
		: null;

	return (
		<>
			<Head>
				<title>Weather Dashboard - AgroCast</title>
				<meta name="description" content="View detailed weather information, agricultural insights, disaster alerts, and air quality data." />
			</Head>
			<div className="min-h-screen flex flex-col bg-[var(--bg)] dark:bg-gray-900">
				<Navbar />
			<main className="flex-1 container mx-auto px-4 py-8">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="max-w-7xl mx-auto"
				>
					<h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
						Weather & Agricultural Insights
					</h1>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
						{/* Left Column */}
						<div className="lg:col-span-1 space-y-6">
							<CitySearch
								onSearch={handleSearch}
								savedCities={savedCities}
								onSelectCity={handleSelectCity}
							/>
							<SavedCities onSelectCity={handleSelectCity} />
						</div>

						{/* Center Column */}
						<div className="lg:col-span-1">
							<WeatherCard
								currentWeather={state.data}
								cityName={cityName}
								timezone={state.timezone}
							/>
						</div>

						{/* Right Column */}
						<div className="lg:col-span-1">
							<MapView
								lat={lat}
								lon={lon}
								cityName={cityName}
								temperature={temperature}
							/>
						</div>
					</div>

					{/* Trend Chart */}
					{state.forecastData && (
						<div className="mb-6">
							<TrendChart forecastData={state.forecastData} />
						</div>
					)}

					{/* Tabs for Features */}
					{state.data && (
						<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
							<div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
								<button
									onClick={() => setActiveTab('agro')}
									className={`px-4 py-2 font-medium transition-colors ${
										activeTab === 'agro'
											? 'text-[var(--agro-green)] border-b-2 border-[var(--agro-green)]'
											: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
									}`}
								>
									Agro Insights
								</button>
								<button
									onClick={() => setActiveTab('disaster')}
									className={`px-4 py-2 font-medium transition-colors ${
										activeTab === 'disaster'
											? 'text-[var(--agro-green)] border-b-2 border-[var(--agro-green)]'
											: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
									}`}
								>
									Disaster Alerts
								</button>
								<button
									onClick={() => setActiveTab('health')}
									className={`px-4 py-2 font-medium transition-colors ${
										activeTab === 'health'
											? 'text-[var(--agro-green)] border-b-2 border-[var(--agro-green)]'
											: 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
									}`}
								>
									Health & AQI
								</button>
							</div>

							<div>
								{activeTab === 'agro' && (
									<AgroInsights
										forecastData={state.forecastData}
										currentWeather={state.data}
									/>
								)}
								{activeTab === 'disaster' && (
									<DisasterAlerts
										forecastData={state.forecastData}
										currentWeather={state.data}
									/>
								)}
								{activeTab === 'health' && (
									<HealthAQI lat={lat} lon={lon} />
								)}
							</div>
						</div>
					)}

					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg"
						>
							{error}
						</motion.div>
					)}
				</motion.div>
			</main>
			<Footer />
		</div>
		</>
	);
}

