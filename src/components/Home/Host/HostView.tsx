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

export default function HostView(): ReactElement {
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const tournament = useAppSelector(state => selectTournament(state))
	const dispatch = useAppDispatch()
	const [loading, setLoading] = useState(false)

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
