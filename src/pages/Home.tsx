import { useQuery } from '@tanstack/react-query'
import getAthletes from 'api/getAthletes'
import Head from 'components/common/Head'
import LoadingOrError from 'components/common/LoadingOrError'
import { type ReactElement, useEffect, useState } from 'react'
import NavBar, { type NavigationItem } from '../components/common/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Stack, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	selectTournament,
	setTournamentAthletes
} from '../features/tournament/tournamentSlice'
import type { IAthlete } from '../app/types'
import { selectUserRole } from '../features/auth/authSlice'
import TournamentConfig from '../components/home/host/TournamentConfig'
import BattleConfig from '../components/home/host/BattleConfig'
import AthleteList from '../components/home/AthleteList'
import { HOSTROLE } from '../app/helpers'

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
		// Add Athletes to athletes list
		if (data) dispatch(setTournamentAthletes(data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

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
				<AthleteList
					athletes={tournament.athletes}
					selectedAthletes={selectedAthletes}
					setSelectedAthletes={setSelectedAthletes}
				/>
				{userRole === HOSTROLE && (
					<>
						<BattleConfig selectedAthletes={selectedAthletes} />
						<TournamentConfig selectedAthletes={selectedAthletes} />
					</>
				)}
			</Stack>
		</>
	)
}
