import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import type { ITournament } from 'app/types'
import TournamentList from 'components/Home/TournamentList'
import LoadingOrError from 'components/Common/LoadingOrError'
import { firebaseGetTournamentsCollection } from '../../../api/Tournament/tournamentApi'

export default function SpectatorView(): ReactElement {
	const [tournaments, setTournaments] = useState<ITournament[]>([])
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

	return <TournamentList tournaments={tournaments} />
}
