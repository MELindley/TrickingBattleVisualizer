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
			<div className='absolute h-dvh w-dvw overflow-hidden'>
				{/* eslint-disable-next-line react/iframe-missing-sandbox */}
				<iframe
					width='1920'
					height='1080'
					src={`${themeOptions.background?.url}&controls=0&showinfo=0&mute=1&disablekb=1&fs=0&loop=1&autoplay=1&modestbranding=1&color=white&iv_load_policy=3&rel=0`}
					referrerPolicy='strict-origin-when-cross-origin'
					title='ytplayer'
					allowFullScreen
					className='absolute left-1/2 top-1/2 -z-50 h-dvh w-dvw -translate-x-1/2 -translate-y-1/2 transform'
				/>
			</div>

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
