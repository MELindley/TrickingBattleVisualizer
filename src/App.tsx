import LoadingOrError from 'components/Common/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { selectTournamentThemeOptions } from './features/tournament/tournamentSlice'
import Layout from './components/Common/Layout'

const Home = lazy(async () => import('pages/Home'))
const Details = lazy(async () => import('pages/Details'))
const Battle = lazy(async () => import('pages/Battle'))
const Tournament = lazy(async () => import('pages/Tournament'))
const Login = lazy(async () => import('pages/auth/Login'))

export default function App(): ReactElement {
	const themeOptions = useAppSelector(state =>
		selectTournamentThemeOptions(state)
	)
	const theme = createTheme(themeOptions)
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Suspense fallback={<LoadingOrError />}>
					<Routes>
						<Route index element={<Home />} />
						<Route path='/' element={<Layout />}>
							<Route path=':athleteName/' element={<Details />} />
							<Route path='battle/' element={<Battle />} />
							<Route
								path='tournament/:tournamentName/'
								element={<Tournament />}
							/>
							<Route path='login/' element={<Login />} />
						</Route>
					</Routes>
				</Suspense>
			</BrowserRouter>
		</ThemeProvider>
	)
}
