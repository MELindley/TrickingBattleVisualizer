import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectTournament } from 'features/tournament/tournamentSlice'
import {
	firebaseUpdateTournamentDocument,
	mapBattleListToReactBracketRoundList
} from 'app/helpers'
import { setActiveBattle } from 'features/battle/battleSlice'
import LoadingOrError from 'components/common/LoadingOrError'
import { Button } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Bracket } from '@sportsgram/brackets'
import CustomSeed from 'components/reactbracket/CustomSeed'
import WinnerView from 'components/battle/WinnerView'
import type { IAthlete } from 'app/types'

export default function TournamentHostView(): ReactElement {
	const navigate = useNavigate()
	const locationState = useLocation().state as {
		updateFirebase: boolean
	} | null
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(selectTournament)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [tournamentUpdated, setTournamentUpdated] = useState(false)

	useEffect(() => {
		const updateTournament = async (): Promise<void> => {
			setIsLoading(true)
			try {
				await firebaseUpdateTournamentDocument(tournament)
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
		if (
			!isLoading &&
			!isError &&
			locationState?.updateFirebase &&
			!tournamentUpdated
		) {
			void updateTournament()
			setTournamentUpdated(true)
		}

		if (isError) {
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [
		dispatch,
		isError,
		isLoading,
		locationState,
		tournament,
		tournamentUpdated
	])

	const onStartBattleClick = (): void => {
		window.scrollTo(0, 0)
		navigate(`/battle/`)
	}

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	return (
		<>
			<Grid container>
				<Grid
					size={12}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Button variant='contained' onClick={onStartBattleClick}>
						Next
					</Button>
				</Grid>
			</Grid>
			{tournament.battles.some(battle => battle.winner === undefined) ? (
				<Bracket
					rounds={mapBattleListToReactBracketRoundList(tournament)}
					renderSeedComponent={CustomSeed}
					twoSided
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
			)}
		</>
	)
}
