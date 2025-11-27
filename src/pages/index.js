import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function HomePage() {
	return (
		<>
			<Head>
				<title>AgroCast - Smart Weather & Agricultural Insights</title>
				<meta name="description" content="AgroCast - Smart weather & agri insights that help farmers plan and protect their crops." />
			</Head>
			<div className="min-h-screen flex flex-col bg-[var(--bg)] dark:bg-gray-900">
				<Navbar />
			<main className="flex-1">
				{/* Hero Section */}
				<section className="container mx-auto px-4 py-16 text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-gray-200 mb-6">
							AgroCast
						</h1>
						<p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
							Smart weather & agri insights that help farmers plan and protect their
							crops.
						</p>
						<Link href="/weather">
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-8 py-4 bg-[var(--agro-green)] text-white rounded-lg text-lg font-semibold hover:bg-[var(--agro-green-dark)] transition-colors shadow-lg"
							>
								Check Weather
							</motion.button>
						</Link>
					</motion.div>
				</section>

				{/* Features Section */}
				<section className="container mx-auto px-4 py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
						{/* Agri Insights Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="text-4xl mb-4">🌾</div>
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
								Agri Insights
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Get crop-specific recommendations based on current and forecasted
								weather conditions. Optimize sowing times and protect your harvest.
							</p>
						</motion.div>

						{/* Disaster Alerts Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="text-4xl mb-4">⚠️</div>
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
								Disaster Alerts
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Receive early warnings for heavy rain, storms, heatwaves, and frost.
								Take proactive measures to safeguard your crops and livestock.
							</p>
						</motion.div>

						{/* Health & AQI Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
						>
							<div className="text-4xl mb-4">🌬️</div>
							<h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-3">
								Health & AQI
							</h3>
							<p className="text-gray-600 dark:text-gray-400">
								Monitor air quality index and get health recommendations for outdoor
								work. Protect yourself and your workers from harmful pollutants.
							</p>
						</motion.div>
					</div>
				</section>

				{/* Preview Section */}
				<section className="container mx-auto px-4 py-12">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
					>
						<h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 text-center">
							Experience Smart Weather Insights
						</h2>
						<div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 h-64 flex items-center justify-center">
							<p className="text-gray-500 dark:text-gray-400 text-center">
								Weather Dashboard Preview
								<br />
								<Link
									href="/weather"
									className="text-[var(--agro-green)] hover:underline mt-2 inline-block"
								>
									Explore Full Features →
								</Link>
							</p>
						</div>
					</motion.div>
				</section>
			</main>
			<Footer />
		</div>
		</>
	);
}
