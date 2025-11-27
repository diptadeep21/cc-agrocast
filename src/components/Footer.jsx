const Footer = () => {
	return (
		<footer className="w-full bg-gray-800 dark:bg-gray-900 text-white py-6 mt-auto">
			<div className="container mx-auto px-4 text-center">
				<p className="text-sm text-gray-400">
					&copy; {new Date().getFullYear()} AgroCast. All rights reserved.
				</p>
				<p className="text-xs text-gray-500 mt-2">
					Weather data provided by{' '}
					<a
						href="https://openweathermap.org"
						target="_blank"
						rel="noopener noreferrer"
						className="hover:text-gray-300 underline"
					>
						OpenWeatherMap
					</a>
				</p>
			</div>
		</footer>
	);
};

export default Footer;

