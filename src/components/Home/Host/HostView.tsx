import AthleteList from '../AthleteList'
import BattleConfig from './BattleConfig'
import TournamentConfig from './TournamentConfig'
import type { ReactElement } from 'react'
import { useState, useEffect } from 'react'
import type { IAthlete } from '../../../app/types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
	selectTournament,
	setTournamentAthletes
} from '../../../features/tournament/tournamentSlice'
import { firebaseGetAthleteCollection } from '../../../app/helpers'
import LoadingOrError from '../../common/LoadingOrError'

export default function HostView(): ReactElement {
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const tournament = useAppSelector(state => selectTournament(state))
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
	}, [dispatch, isError, isLoading, tournament.athletes])

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	return (
		<>
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
