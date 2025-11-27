import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
	() => import('react-leaflet').then((mod) => mod.MapContainer),
	{ ssr: false }
);
const TileLayer = dynamic(
	() => import('react-leaflet').then((mod) => mod.TileLayer),
	{ ssr: false }
);
const Marker = dynamic(
	() => import('react-leaflet').then((mod) => mod.Marker),
	{ ssr: false }
);
const Popup = dynamic(
	() => import('react-leaflet').then((mod) => mod.Popup),
	{ ssr: false }
);

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
	import('leaflet').then((L) => {
		delete L.default.Icon.Default.prototype._getIconUrl;
		L.default.Icon.Default.mergeOptions({
			iconRetinaUrl:
				'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
			iconUrl:
				'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
			shadowUrl:
				'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
		});
	});
}

const MapView = ({ lat, lon, cityName, temperature }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!lat || !lon) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-64 flex items-center justify-center">
				<p className="text-gray-500">No location data available</p>
			</div>
		);
	}

	if (!mounted) {
		return (
			<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg h-64 flex items-center justify-center">
				<p className="text-gray-500">Loading map...</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
		>
			<MapContainer
				center={[lat, lon]}
				zoom={10}
				style={{ height: '400px', width: '100%' }}
				scrollWheelZoom={false}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[lat, lon]}>
					<Popup>
						<div>
							<p className="font-semibold">{cityName}</p>
							{temperature && <p>Temperature: {temperature}°C</p>}
						</div>
					</Popup>
				</Marker>
			</MapContainer>
		</motion.div>
	);
};

export default MapView;

