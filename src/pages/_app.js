import '@/styles/globals.css';
import { WeatherDataProvider } from '@/utils/WeatherDataReducer';
import { ThemeProvider } from 'next-themes';
import { SnackbarProvider } from 'notistack';
import '../i18n';

export default function App({ Component, pageProps }) {
	return (
		<ThemeProvider attribute="class">
			<WeatherDataProvider>
				<SnackbarProvider maxSnack={3}>
					<Component {...pageProps} />
				</SnackbarProvider>
			</WeatherDataProvider>
		</ThemeProvider>
	);
}
