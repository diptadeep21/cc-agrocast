import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SavedCities = ({ onSelectCity }) => {
	const [savedCities, setSavedCities] = useState([]);

	useEffect(() => {
		loadSavedCities();
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

	const clearSavedCities = () => {
		localStorage.removeItem('agrocast.savedCities');
		setSavedCities([]);
	};

	if (savedCities.length === 0) {
		return null;
	}

	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
			<div className="flex justify-between items-center mb-3">
				<h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
					Saved Cities
				</h3>
				<button
					onClick={clearSavedCities}
					className="text-sm text-red-600 dark:text-red-400 hover:underline"
				>
					Clear All
				</button>
			</div>
			<div className="space-y-2">
				{savedCities.map((city, idx) => (
					<motion.div
						key={idx}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => onSelectCity(city)}
						className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
					>
						<div className="flex justify-between items-center">
							<div>
								<p className="font-medium text-gray-800 dark:text-gray-200">
									{city.city}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-400">
									{new Date(city.timestamp).toLocaleDateString()}
								</p>
							</div>
							<span className="text-gray-400">→</span>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default SavedCities;

