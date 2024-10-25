import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { ITournament } from '../../../app/types'
import { firebaseGetTournamentsCollection } from '../../../app/helpers'
import TournamentList from './TournamentList'
import { Button } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hooks'
import { selectTournament } from '../../../features/tournament/tournamentSlice'

export default function SpectatorView(): ReactElement {
	const [loading, setLoading] = useState(false)
	const [tournaments, setTournaments] = useState<ITournament[]>([])
	const navigate = useNavigate()
	const tournament = useAppSelector(state => selectTournament(state))

	useEffect(() => {
		// Add tournaments to tournament list
		const fetchTournaments = async (): Promise<void> => {
			setLoading(true)
			try {
				const tournamentsData = await firebaseGetTournamentsCollection()
				setTournaments(tournamentsData)
			} catch {
				/* empty */
			} finally {
				setLoading(false)
			}
		}
		if (!loading && tournaments.length === 0) {
			void fetchTournaments()
		}
	}, [loading, tournaments])

	function onClick(): void {
		navigate(`/tournament/${tournament.name}/`)
	}

	return (
		<Grid container spacing={4}>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<TournamentList tournaments={tournaments} />
			</Grid>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Button variant='contained' onClick={onClick}>
					Start Tournament
				</Button>
			</Grid>
		</Grid>
	)
}
