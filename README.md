# AgroCast

AgroCast is a smart weather and agricultural insights platform designed to help farmers plan and protect their crops. It provides real-time weather data, agricultural recommendations, disaster alerts, and air quality information.

## Features

- **Real-time Weather Data**: Current conditions, forecasts, and detailed meteorological information
- **Agricultural Insights**: Crop-specific recommendations based on weather conditions
- **Disaster Alerts**: Early warnings for heavy rain, storms, heatwaves, and frost
- **Health & Air Quality**: AQI monitoring and health recommendations for outdoor work
- **Interactive Maps**: Visual location tracking with weather overlays
- **Trend Analysis**: 7-day temperature and precipitation forecasts
- **Saved Cities**: Quick access to previously searched locations

## Technology Stack

- **Framework**: Next.js 14.2.5
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Maps**: React Leaflet + Leaflet
- **Animations**: Framer Motion
- **Theme**: next-themes (dark mode support)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Weather-WebApp-main
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_OPENWEATHER_KEY=your_api_key_here
```

**Important**: The `.env.local` file should be added to `.gitignore` and never committed to version control.

### Running Locally

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment on AWS Amplify

### Setting Up Environment Variables

1. Go to your AWS Amplify Console
2. Navigate to your app → **App settings** → **Environment variables**
3. Add the following environment variable:
   - **Key**: `NEXT_PUBLIC_OPENWEATHER_KEY`
   - **Value**: Your OpenWeatherMap API key

### Build Settings

Amplify will automatically detect Next.js and use the default build settings:
- **Build command**: `npm run build` (or `yarn build` / `pnpm build`)
- **Output directory**: `.next`

No additional configuration needed. The app will build and deploy automatically.

### Important Notes for Amplify

- All API calls are made from the client-side (frontend-only)
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit API keys to the repository
- The app uses OpenStreetMap tiles (no API key required for maps)

## Manual Testing Checklist

Before deploying, verify the following:

1. ✅ Search for a valid city (e.g., "Mumbai") — verify weather + forecast + map + chart + AQI
2. ✅ Search for an invalid city (e.g., "asdfjkl") — verify friendly error message
3. ✅ After an error, search for a valid city — verify error clears and data loads
4. ✅ Check saved cities appear and clicking one reloads its weather
5. ✅ Resize to mobile — ensure responsive layout works
6. ✅ Test dark mode toggle
7. ✅ Verify `NEXT_PUBLIC_OPENWEATHER_KEY` is set locally and in Amplify

## Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx       # Footer component
│   ├── CitySearch.jsx  # City search input
│   ├── WeatherCard.jsx # Current weather display
│   ├── TrendChart.jsx  # Temperature/precipitation chart
│   ├── MapView.jsx     # Interactive map
│   ├── AgroInsights.jsx # Agricultural recommendations
│   ├── DisasterAlerts.jsx # Weather alerts
│   ├── HealthAQI.jsx   # Air quality display
│   └── SavedCities.jsx # Saved cities list
├── pages/              # Next.js pages
│   ├── index.js        # Home page
│   ├── weather.js      # Weather dashboard
│   └── about.js        # About page
├── data/               # Static data files
│   ├── cropData.json   # Crop information
│   └── healthRules.json # AQI health rules
├── styles/             # Global styles
│   ├── globals.css     # Global CSS
│   ├── theme.css       # Theme variables
│   └── animations.css  # Animation styles
└── utils/              # Utility functions
    ├── FetchWeatherData.js # Weather API calls
    └── WeatherDataReducer.js # State management
```

## API Usage

This app uses the OpenWeatherMap API:
- **Current Weather**: `/data/2.5/weather`
- **Forecast**: `/data/2.5/forecast`
- **One Call API 3.0**: `/data/3.0/onecall` (with fallback)
- **Geocoding**: `/geo/1.0/direct`
- **Air Pollution**: `/data/2.5/air_pollution`

All API calls are made from the client-side. The API key must be set as an environment variable.

## Error Handling

The app includes comprehensive error handling:
- Invalid city names show friendly error messages
- Network errors are caught and displayed
- HTML responses (common on misconfigured deployments) are detected
- Errors clear automatically when new searches begin
- API calls are cancellable to prevent race conditions

## License

This project is private and proprietary.

## Attribution

Weather data provided by [OpenWeatherMap](https://openweathermap.org)
Map tiles by [OpenStreetMap](https://www.openstreetmap.org/copyright)
# cc-agro-app
