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
import LoadingOrError from '../../common/LoadingOrError'

export default function SpectatorView(): ReactElement {
	const [tournaments, setTournaments] = useState<ITournament[]>([])
	const navigate = useNavigate()
	const tournament = useAppSelector(state => selectTournament(state))
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()

	useEffect(() => {
		// Add tournaments to tournament list
		const fetchTournaments = async (): Promise<void> => {
			setIsLoading(true)
			try {
				const tournamentsData = await firebaseGetTournamentsCollection()
				setTournaments(tournamentsData)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}
		if (!isLoading && !isError && tournaments.length === 0) {
			void fetchTournaments()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [isLoading, isError, tournaments])

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

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
