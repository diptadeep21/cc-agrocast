import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CitySearch = ({ onSearch, savedCities = [], onSelectCity }) => {
	const [query, setQuery] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const abortControllerRef = useRef(null);

	// Clear error when input changes
	const handleInputChange = (e) => {
		setQuery(e.target.value);
		setError(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!query.trim()) return;

		// Cancel previous request if any
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		abortControllerRef.current = new AbortController();
		setLoading(true);
		setError(null);

		try {
			await onSearch(query.trim(), abortControllerRef.current.signal);
			setQuery('');
		} catch (err) {
			if (err.name !== 'AbortError') {
				setError(err.message || 'Failed to fetch weather data');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	return (
		<div className="w-full">
			<form onSubmit={handleSubmit} className="flex gap-2 mb-4">
				<input
					type="text"
					value={query}
					onChange={handleInputChange}
					placeholder="Enter city name..."
					className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--agro-green)] dark:bg-gray-700 dark:text-white"
				/>
				<button
					type="submit"
					disabled={loading}
					className="px-6 py-2 bg-[var(--agro-green)] text-white rounded-lg hover:bg-[var(--agro-green-dark)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
				>
					{loading ? 'Searching...' : 'Search'}
				</button>
			</form>

			{error && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 rounded-lg text-sm"
				>
					{error}
				</motion.div>
			)}

			{savedCities.length > 0 && (
				<div className="mt-4">
					<h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
						Recent Searches:
					</h3>
					<div className="flex flex-wrap gap-2">
						{savedCities.slice(0, 5).map((city, idx) => (
							<motion.button
								key={idx}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => onSelectCity(city)}
								className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
							>
								{city.city}
							</motion.button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CitySearch;

