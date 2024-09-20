import type { ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Head from '../components/common/Head'
import NavBar from '../components/common/Navbar'
import { mainNavigation } from './Home'
import { Button, Container } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'
import {
	resetActiveBattle,
	selectActiveBattle
} from '../features/battle/battleSlice'
import BattleView from '../components/battle/BattleView'
import WinnerView from '../components/battle/WinnerView'
import Grid from '@mui/material/Unstable_Grid2'
import {
	selectTournament,
	setNextTournamentBattleAthlete,
	updateBattleInTournamentByID
} from '../features/tournament/tournamentSlice'

export default function BattlePage(): ReactElement {
	const activeBattle = useAppSelector((state: RootState) =>
		selectActiveBattle(state)
	)
	const tournament = useAppSelector((state: RootState) =>
		selectTournament(state)
	)

	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	if (activeBattle.athletes.length === 0) {
		return <Navigate to='/' replace />
	}

	// eslint-disable-next-line unicorn/no-array-reduce
	const title = activeBattle.athletes.reduce(
		(accumulator, athlete, index) =>
			index === 0
				? accumulator + (athlete?.name ?? 'TBD')
				: `${accumulator} VS ${athlete?.name ?? 'TDB'}`,
		''
	)

	const onContinueClick = (): void => {
		window.scrollTo(0, 0)
		if (
			activeBattle.id === -1 ||
			!tournament.battles.some(b => b.id === activeBattle.id)
		) {
			// One shot battle, go back to home screen
			dispatch(resetActiveBattle())
			navigate('/')
		} else {
			// Update the battle in Tournament
			dispatch(updateBattleInTournamentByID(activeBattle))
			if (activeBattle.winner)
				dispatch(setNextTournamentBattleAthlete(activeBattle.winner))
			// Navigate to tournament home page
			navigate(`/tournament/${tournament.name}/`)
		}
	}

	return (
		<>
			<Head title={title} />
			<NavBar navigation={mainNavigation} />
			<Container sx={{ p: 4 }}>
				{activeBattle.winner ? (
					<>
						<WinnerView winner={activeBattle.winner} />
						<Grid container sx={{ mt: 4 }}>
							<Grid
								xs={12}
								display='flex'
								justifyContent='center'
								alignItems='center'
							>
								<Button variant='contained' onClick={onContinueClick}>
									Continue
								</Button>
							</Grid>
						</Grid>
					</>
				) : (
					<BattleView battle={activeBattle} />
				)}
			</Container>
		</>
	)
}
