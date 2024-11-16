import AthleteList from '../AthleteList'
import TournamentList from '../TournamentList'
import BattleConfig from './BattleConfig'
import TournamentConfig from './TournamentConfig'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { IAthlete, ITournament } from '../../../app/types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
	selectTournament,
	setTournamentAthletes
} from '../../../features/tournament/tournamentSlice'
import {
	firebaseGetAthleteCollection,
	firebaseGetTournamentsCollection
} from '../../../app/helpers'
import LoadingOrError from '../../common/LoadingOrError'
import { selectUID } from '../../../features/auth/authSlice'
import { where } from 'firebase/firestore'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

export default function HostView(): ReactElement {
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const [tournaments, setTournaments] = useState<ITournament[]>([])
	const tournament = useAppSelector(state => selectTournament(state))
	const hostUID = useAppSelector(state => selectUID(state))
	const dispatch = useAppDispatch()
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()

	useEffect(() => {
		// Add Athletes to athletes list
		const fetchAthletes = async (): Promise<void> => {
			setIsLoading(true)
			try {
				const athletes = await firebaseGetAthleteCollection()
				dispatch(setTournamentAthletes(athletes))
				const tournamentsData = await firebaseGetTournamentsCollection(
					where('hostUID', '==', hostUID)
				)
				setTournaments(tournamentsData)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}
		if (!isLoading && !isError && tournament.athletes.length === 0) {
			void fetchAthletes()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [dispatch, hostUID, isError, isLoading, tournament.athletes])

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	return (
		<>
			<TournamentList tournaments={tournaments} title='Resume Tournament' />
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h3'>Create a New Tournament</Typography>
			</Grid>
			<AthleteList
				athletes={tournament.athletes}
				selectedAthletes={selectedAthletes}
				setSelectedAthletes={setSelectedAthletes}
			/>
			<BattleConfig selectedAthletes={selectedAthletes} />
			<TournamentConfig selectedAthletes={selectedAthletes} />
		</>
	)
}
