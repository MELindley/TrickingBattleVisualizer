import { useQuery } from '@tanstack/react-query'
import getAthletes from 'api/getAthletes'
import AthleteCard from 'components/AthleteCard'
import Head from 'components/Head'
import LoadingOrError from 'components/LoadingOrError'
import type { ReactElement } from 'react'
import NavBar, { type NavigationItem } from '../components/Navbar'
import { useAppSelector } from 'app/hooks'
import { selectBattleAthletes } from '../features/battle/battleSlice'
import type { RootState } from '../app/store'

export const mainNavigation: NavigationItem[] = [{ name: 'Home', href: '/' }]

export default function HomePage(): ReactElement {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athletes'],
		queryFn: getAthletes
	})

	const athletesInBattle = useAppSelector((state: RootState) =>
		selectBattleAthletes(state)
	)

	if (isPending || isError) {
		return <LoadingOrError error={error as Error} />
	}
	return (
		<>
			<Head title='Tricking Battle Visualizer' />
			<NavBar navigation={mainNavigation} />
			<div className='m-2 grid min-h-screen grid-cols-[minmax(0,384px)] place-content-center gap-2 md:m-0 md:grid-cols-[repeat(2,minmax(0,384px))] xl:grid-cols-[repeat(3,384px)]'>
				{data.map(athlete => (
					<AthleteCard key={`AthleteCard-${athlete.name}`} athlete={athlete} />
				))}
			</div>
			<div>
				Athletes in battle:
				{athletesInBattle.map(athlete => (
					<div key={athlete.name}>{athlete.name}</div>
				))}
			</div>
		</>
	)
}
