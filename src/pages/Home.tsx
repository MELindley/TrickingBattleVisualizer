import { useQuery } from '@tanstack/react-query'
import getAthletes from 'api/getAthletes'
import AthleteCard from 'components/Athlete/AthleteCard'
import Head from 'components/Common/Head'
import LoadingOrError from 'components/Common/LoadingOrError'
import { type ReactElement, useEffect, useState } from 'react'
import NavBar, { type NavigationItem } from '../components/Common/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { resetActiveBattle } from '../features/battle/battleSlice'
import {
	selectTournament,
	setTournamentAthletes
} from '../features/tournament/tournamentSlice'
import type { IAthlete } from '../app/types'
import { selectUserRole } from '../features/auth/authSlice'
import TournamentConfig from '../components/Home/Host/TournamentConfig'
import BattleConfig from '../components/Home/Host/BattleConfig'

export const mainNavigation: NavigationItem[] = [
	{ name: 'Home', href: '/' },
	{ name: 'Login', href: '/login/' }
]

export default function HomePage(): ReactElement {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athletes'],
		queryFn: getAthletes
	})
	const dispatch = useAppDispatch()
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const tournament = useAppSelector(state => selectTournament(state))
	const userRole = useAppSelector(state => selectUserRole(state))

	useEffect(() => {
		// Clean potential leftovers from previous battle
		dispatch(resetActiveBattle())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// Add Athletes to athletes list
		if (data) dispatch(setTournamentAthletes(data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const onAthleteCardClick = (athlete: IAthlete): void => {
		// Check if the athlete is in the array of selected athletes
		const index = selectedAthletes.indexOf(athlete)
		if (index >= 0) {
			// if so remove him
			setSelectedAthletes(selectedAthletes.toSpliced(index, 1))
		} else {
			// Add the athlete to the selected athletes array
			setSelectedAthletes([...selectedAthletes, athlete])
		}
	}

	if (isPending || isError) {
		return <LoadingOrError error={error as Error} />
	}
	return (
		<>
			<Head title='Tricking Battle Visualizer' />
			<NavBar navigation={mainNavigation} />
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h1'>{tournament.name}</Typography>
			</Grid>
			<Stack spacing={4} justifyContent='center' sx={{ p: 4 }}>
				<Grid container rowSpacing={4} sx={{ boxShadow: 3, borderRadius: 2 }}>
					<Grid
						xs={12}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Typography variant='h3'>Athletes</Typography>
					</Grid>
					{tournament.athletes.map(athlete => (
						<Grid
							xs={6}
							md={3}
							key={`AthleteCardGrid-${athlete.name}`}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<AthleteCard
								athlete={athlete}
								onCardClick={onAthleteCardClick}
								hasDetailsButton
							/>
						</Grid>
					))}
				</Grid>
				{userRole === 'host' && (
					<>
						<BattleConfig selectedAthletes={selectedAthletes} />
						<TournamentConfig selectedAthletes={selectedAthletes} />
					</>
				)}
			</Stack>
		</>
	)
}
