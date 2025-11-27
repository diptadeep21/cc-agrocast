/**
 * Fetch weather data with proper error handling
 * Handles HTML responses, network errors, and API errors
 */

const fetchJson = async (url, signal) => {
	const response = await fetch(url, { signal });
	const text = await response.text();

	if (!response.ok) {
		// Check if response is HTML (common error on Amplify)
		if (text.trim().startsWith('<')) {
			throw new Error('Unexpected HTML response from server. Check API URL or CORS settings.');
		}
		throw new Error(`HTTP ${response.status}: ${text.substring(0, 100)}`);
	}

	// Check if response is HTML even if status is OK
	if (text.trim().startsWith('<')) {
		throw new Error('Unexpected HTML response from server. Check API URL or CORS settings.');
	}

	try {
		return JSON.parse(text);
	} catch (parseError) {
		throw new Error('Invalid JSON response from server');
	}
};

export const fetchWeatherData = async ({
	lat = null,
	long = null,
	searchQuery = null,
	signal = null,
}) => {
	const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_KEY || process.env.REACT_APP_OPENWEATHER_KEY;
	if (!apiKey) {
		throw new Error('OpenWeather API key not configured. Please set NEXT_PUBLIC_OPENWEATHER_KEY or REACT_APP_OPENWEATHER_KEY environment variable.');
	}

	let latitude = lat;
	let longitude = long;
	let data = null;
	let forecastData = null;
	let airPollutionData = null;
	let timezone = null;
	let cityName = null;

	try {
		// If search query provided, get coordinates first
		if (searchQuery && searchQuery.trim() !== '') {
			// Geocoding API to get lat/lon from city name
			const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
				searchQuery.trim()
			)}&limit=1&appid=${apiKey}`;

			const geoData = await fetchJson(geoUrl, signal);
			
			if (!geoData || geoData.length === 0) {
				throw new Error('City not found. Please check the city name and try again.');
			}

			latitude = geoData[0].lat;
			longitude = geoData[0].lon;
			cityName = geoData[0].name;
		}

		// If we have coordinates, fetch weather data
		if (latitude && longitude) {
			// Use One Call API 3.0 for comprehensive data
			// Fallback to current + forecast if One Call not available
			const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${apiKey}`;
			
			try {
				// Try One Call API first
				const oneCallData = await fetchJson(oneCallUrl, signal);
				data = {
					coord: { lat: latitude, lon: longitude },
					main: {
						temp: oneCallData.current.temp + 273.15, // Convert to Kelvin for consistency
						feels_like: oneCallData.current.feels_like + 273.15,
						humidity: oneCallData.current.humidity,
						pressure: oneCallData.current.pressure,
					},
					wind: { speed: oneCallData.current.wind_speed },
					weather: oneCallData.current.weather,
					visibility: oneCallData.current.visibility,
					dt: oneCallData.current.dt,
					sys: {
						sunrise: oneCallData.current.sunrise,
						sunset: oneCallData.current.sunset,
					},
					name: cityName || 'Unknown',
					timezone: oneCallData.timezone_offset,
				};

				// Convert daily forecast to 3-hour format for compatibility
				forecastData = {
					list: oneCallData.daily.slice(0, 7).flatMap((day, idx) => {
						// Create 3-hour intervals for the day
						return [
							{
								dt: day.dt,
								main: {
									temp: day.temp.day + 273.15,
									temp_min: day.temp.min + 273.15,
									temp_max: day.temp.max + 273.15,
									humidity: day.humidity,
									pressure: day.pressure,
								},
								weather: day.weather,
								wind: { speed: day.wind_speed },
								pop: day.pop || 0,
								rain: day.rain ? { '3h': day.rain } : null,
							},
						];
					}),
				};

				timezone = oneCallData.timezone_offset;
			} catch (oneCallError) {
				// Fallback to separate current + forecast APIs
				const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
				const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

				[data, forecastData] = await Promise.all([
					fetchJson(currentUrl, signal),
					fetchJson(forecastUrl, signal),
				]);

				timezone = data.timezone;
				cityName = cityName || data.name;
			}

			// Fetch air pollution data
			try {
				const airPollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
				airPollutionData = await fetchJson(airPollutionUrl, signal);
			} catch (airError) {
				// Air pollution is optional, don't fail if it's not available
				console.warn('Air pollution data not available:', airError.message);
			}

			// Save to localStorage
			if (cityName) {
				const savedCities = JSON.parse(
					localStorage.getItem('agrocast.savedCities') || '[]'
				);
				const newCity = {
					city: cityName,
					lat: latitude,
					lon: longitude,
					timestamp: Date.now(),
				};

				// Remove duplicate if exists
				const filtered = savedCities.filter(
					(c) => c.city !== cityName && c.lat !== latitude && c.lon !== longitude
				);
				filtered.unshift(newCity);
				// Keep only last 10
				localStorage.setItem('agrocast.savedCities', JSON.stringify(filtered.slice(0, 10)));
			}

			// Store weather data
			localStorage.setItem('weather-data', JSON.stringify(data));
			localStorage.setItem('forecast-data', JSON.stringify(forecastData));
			if (timezone) {
				localStorage.setItem('timezone', timezone.toString());
			}
		} else {
			throw new Error('No location provided. Please provide coordinates or city name.');
		}

		return {
			data,
			forecastData,
			airPollutionData,
			timezone,
			cityName,
		};
	} catch (error) {
		// Don't save error to localStorage
		if (error.name === 'AbortError') {
			throw error; // Re-throw abort errors
		}
		throw new Error(error.message || 'Failed to fetch weather data');
	}
};
