import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import NavBar from '../components/common/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Stack } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectTournament } from '../features/tournament/tournamentSlice'
import { setActiveBattle } from '../features/battle/battleSlice'
import { mainNavigation } from './Home'
import { Bracket } from '@sportsgram/brackets'
import {
	firebaseUpdateTournamentDocument,
	HOST_ROLE,
	mapBattleListToReactBracketRoundList
} from '../app/helpers'
import CustomSeed from '../components/reactbracket/CustomSeed'
import WinnerView from '../components/battle/WinnerView'
import type { IAthlete, ITournament } from '../app/types'
import { selectUserRole } from '../features/auth/authSlice'

export default function TournamentPage(): ReactElement {
	const navigate = useNavigate()
	const locationState = useLocation().state as {
		updateFirebase: boolean
	} | null
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(state => selectTournament(state))
	const userRole = useAppSelector(state => selectUserRole(state))

	useEffect(() => {
		const updateTournament = async (
			updatedTournament: ITournament
		): Promise<void> => {
			console.log(updatedTournament)
			try {
				await firebaseUpdateTournamentDocument(updatedTournament)
			} catch (error) {
				console.log('Firebase Error Updating Tournament', error)
			}
		}

		dispatch(
			setActiveBattle(
				tournament.battles.find(battle => battle.winner === undefined)
			)
		)
		if (locationState?.updateFirebase) {
			void updateTournament(tournament)
		}
	}, [dispatch, locationState, tournament, tournament.battles])

	const onStartBattleClick = (): void => {
		window.scrollTo(0, 0)
		navigate(`/battle/`)
	}

	return (
		<>
			<Head title='Tricking Battle Visualizer' />
			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				<NavBar navigation={mainNavigation} />
				{userRole === HOST_ROLE && (
					<Grid container>
						<Grid
							xs={12}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<Button variant='contained' onClick={onStartBattleClick}>
								Next
							</Button>
						</Grid>
					</Grid>
				)}
				{tournament.battles.some(battle => battle.winner === undefined) ? (
					<Bracket
						rounds={mapBattleListToReactBracketRoundList(tournament)}
						renderSeedComponent={CustomSeed}
						twoSided
					/>
				) : (
					<WinnerView winner={tournament.battles.at(-1)?.winner as IAthlete} />
				)}
			</Stack>
		</>
	)
}
