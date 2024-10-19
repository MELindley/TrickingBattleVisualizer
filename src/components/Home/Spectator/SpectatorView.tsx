import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { ITournament } from '../../../app/types'
import { firebaseGetTournamentsCollection } from '../../../app/helpers'
import TournamentList from './TournamentList'

export default function SpectatorView(): ReactElement {
	const [loading, setLoading] = useState(false)
	const [tournaments, setTournaments] = useState<ITournament[]>([])

	useEffect(() => {
		// Add Athletes to athletes list
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

	return <TournamentList tournaments={tournaments} />
}
