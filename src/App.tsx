import LoadingOrError from 'components/LoadingOrError'
import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Home = lazy(async () => import('pages/Home'))
const Details = lazy(async () => import('pages/Details'))
const Battle = lazy(async () => import('pages/Battle'))
const Tournament = lazy(async () => import('pages/Tournament'))

export default function App(): ReactElement {
	return (
		<BrowserRouter>
			<Suspense fallback={<LoadingOrError />}>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path=':athleteName' element={<Details />} />
					<Route path='/battle/' element={<Battle />} />
					<Route path='/tournament/' element={<Tournament />} />
				</Routes>
			</Suspense>
		</BrowserRouter>
	)
}
