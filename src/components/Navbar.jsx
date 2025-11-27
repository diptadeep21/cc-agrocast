import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const Navbar = () => {
	const router = useRouter();

	return (
		<nav className="w-full bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
			<div className="container mx-auto px-4 py-3">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center space-x-2">
						<motion.div
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							className="flex items-center space-x-2"
						>
							<span className="text-2xl">🌱</span>
							<span className="text-xl font-bold text-[var(--agro-green)] dark:text-green-400">
								AgroCast
							</span>
						</motion.div>
					</Link>
					<div className="flex items-center space-x-6">
						<Link
							href="/"
							className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								router.pathname === '/'
									? 'text-[var(--agro-green)] dark:text-green-400 font-semibold'
									: 'text-gray-700 dark:text-gray-300 hover:text-[var(--agro-green)] dark:hover:text-green-400'
							}`}
						>
							Home
						</Link>
						<Link
							href="/weather"
							className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								router.pathname === '/weather'
									? 'text-[var(--agro-green)] dark:text-green-400 font-semibold'
									: 'text-gray-700 dark:text-gray-300 hover:text-[var(--agro-green)] dark:hover:text-green-400'
							}`}
						>
							Weather
						</Link>
						<Link
							href="/about"
							className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								router.pathname === '/about'
									? 'text-[var(--agro-green)] dark:text-green-400 font-semibold'
									: 'text-gray-700 dark:text-gray-300 hover:text-[var(--agro-green)] dark:hover:text-green-400'
							}`}
						>
							About
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;

