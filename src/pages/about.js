import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function AboutPage() {
	return (
		<>
			<Head>
				<title>About - AgroCast</title>
				<meta name="description" content="Learn more about AgroCast - Smart weather & agricultural insights platform." />
			</Head>
			<div className="min-h-screen flex flex-col bg-[var(--bg)] dark:bg-gray-900">
				<Navbar />
			<main className="flex-1 container mx-auto px-4 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="max-w-4xl mx-auto"
				>
					<h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
						About AgroCast
					</h1>

					<div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
						<section>
							<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
								What is AgroCast?
							</h2>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								AgroCast is a smart weather and agricultural insights platform designed
								to help farmers plan and protect their crops. We provide real-time
								weather data, agricultural recommendations, disaster alerts, and air
								quality information to support informed farming decisions.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
								Features
							</h2>
							<ul className="space-y-3 text-gray-700 dark:text-gray-300">
								<li className="flex items-start">
									<span className="text-[var(--agro-green)] mr-2">✓</span>
									<span>
										<strong>Real-time Weather Data:</strong> Current conditions,
										forecasts, and detailed meteorological information
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-[var(--agro-green)] mr-2">✓</span>
									<span>
										<strong>Agricultural Insights:</strong> Crop-specific
										recommendations based on weather conditions
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-[var(--agro-green)] mr-2">✓</span>
									<span>
										<strong>Disaster Alerts:</strong> Early warnings for heavy
										rain, storms, heatwaves, and frost
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-[var(--agro-green)] mr-2">✓</span>
									<span>
										<strong>Health & Air Quality:</strong> AQI monitoring and
										health recommendations for outdoor work
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-[var(--agro-green)] mr-2">✓</span>
									<span>
										<strong>Interactive Maps:</strong> Visual location tracking
										with weather overlays
									</span>
								</li>
								<li className="flex items-start">
									<span className="text-[var(--agro-green)] mr-2">✓</span>
									<span>
										<strong>Trend Analysis:</strong> 7-day temperature and
										precipitation forecasts
									</span>
								</li>
							</ul>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
								Technology
							</h2>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								AgroCast is built with Next.js, React, and modern web technologies.
								Weather data is provided by OpenWeatherMap API, and maps are powered
								by OpenStreetMap.
							</p>
						</section>

						<section>
							<h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
								Contact & Support
							</h2>
							<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
								For questions, feedback, or support, please refer to the project
								documentation or contact the development team.
							</p>
						</section>
					</div>
				</motion.div>
			</main>
			<Footer />
		</div>
		</>
	);
}

