import Head from 'components/common/Head'
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
import { firebaseGetAthleteCollection, HOST_ROLE } from '../app/helpers'

export const mainNavigation: NavigationItem[] = [
	{ name: 'Home', href: '/' },
	{ name: 'Login', href: '/login/' },
	{ name: 'Tournament', href: '/tournament/' }
]

export default function HomePage(): ReactElement {
	const dispatch = useAppDispatch()
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const [loading, setLoading] = useState(false)
	const tournament = useAppSelector(state => selectTournament(state))
	const userRole = useAppSelector(state => selectUserRole(state))

	useEffect(() => {
		// Add Athletes to athletes list
		const fetchAthletes = async (): Promise<void> => {
			setLoading(true)
			try {
				const athletes = await firebaseGetAthleteCollection()
				dispatch(setTournamentAthletes(athletes))
			} catch {
				/* empty */
			} finally {
				setLoading(false)
			}
		}
		if (!loading && tournament.athletes.length === 0) {
			void fetchAthletes()
		}
	}, [dispatch, loading, tournament.athletes])

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
				{userRole === HOST_ROLE && (
					<>
						<BattleConfig selectedAthletes={selectedAthletes} />
						<TournamentConfig selectedAthletes={selectedAthletes} />
					</>
				)}
			</Stack>
		</>
	)
}
