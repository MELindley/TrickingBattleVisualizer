import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
	selectTournament,
	setTournamentBattles
} from 'features/tournament/tournamentSlice'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import {
	firebaseSetTournamentBattlesListener,
	mapBattleListToReactBracketRoundList
} from 'app/helpers'
import { setActiveBattle } from 'features/battle/battleSlice'
import LoadingOrError from 'components/common/LoadingOrError'
import WinnerView from 'components/battle/WinnerView'
import type { IAthlete } from 'app/types'
import CustomSeed from 'components/reactbracket/CustomSeed'
import { Bracket } from '@sportsgram/brackets'

export default function TournamentSpectatorView(): ReactElement {
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(selectTournament)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [isListenerSet, setIsListenerSet] = useState(false)

	useEffect(() => {
		const listenToTournamentBattles = async (): Promise<void> => {
			setIsLoading(true)
			try {
				await firebaseSetTournamentBattlesListener(tournament.id, battles =>
					dispatch(setTournamentBattles(battles))
				)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}

		dispatch(
			setActiveBattle(
				tournament.battles.find(battle => battle.winner === undefined)
			)
		)
		if (!isLoading && !isError && !isListenerSet) {
			void listenToTournamentBattles()
			setIsListenerSet(true)
		}

		if (isError) {
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [dispatch, isError, isListenerSet, isLoading, tournament])

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	return tournament.battles.some(battle => battle.winner === undefined) ? (
		<Bracket
			rounds={mapBattleListToReactBracketRoundList(tournament)}
			renderSeedComponent={CustomSeed}
			twoSided
			bracketClassName='w-min'
		/>
	) : (
		<>
			<WinnerView winner={tournament.battles.at(-1)?.winner as IAthlete} />
			<Bracket
				rounds={mapBattleListToReactBracketRoundList(tournament)}
				renderSeedComponent={CustomSeed}
				twoSided
			/>
		</>
	)
}
