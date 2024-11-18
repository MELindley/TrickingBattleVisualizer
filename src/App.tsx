import LoadingOrError from 'components/common/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAppSelector } from './app/hooks'
import { createTheme, ThemeProvider } from '@mui/material'
import { selectTournamentThemeOptions } from './features/tournament/tournamentSlice'

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
			<BrowserRouter>
				<Suspense fallback={<LoadingOrError />}>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path=':athleteName/' element={<Details />} />
						<Route path='/battle/' element={<Battle />} />
						<Route
							path='/tournament/:tournamentName/'
							element={<Tournament />}
						/>
						<Route path='/login/' element={<Login />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</ThemeProvider>
	)
}
