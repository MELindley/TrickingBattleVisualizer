import type { ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Head from 'components/common/Head'
import NavBar from 'components/common/Navbar'
import { mainNavigation } from './Home'
import { Button, Container, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import type { RootState } from 'app/store'
import {
	resetActiveBattle,
	selectActiveBattle
} from 'features/battle/battleSlice'
import BattleView from 'components/battle/BattleView'
import WinnerView from 'components/battle/WinnerView'
import Grid from '@mui/material/Grid2'
import {
	selectTournament,
	setFinalBattleAthlete,
	setNextTournamentBattleAthlete,
	updateBattleInTournamentByID
} from 'features/tournament/tournamentSlice'

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
	// @ts-expect-error Handle function must return void
	const onContinueClick = async (): void => {
		window.scrollTo(0, 0)
		if (
			activeBattle.id === '-1' ||
			!tournament.battles.some(b => b.id === activeBattle.id)
		) {
			// One shot battle, go back to home screen
			dispatch(resetActiveBattle())
			navigate('/')
		} else {
			// Update the battle in Tournament
			dispatch(updateBattleInTournamentByID(activeBattle))
			if (activeBattle.winner) {
				// if this is the semi-finals, loser goes to next battle (3rd place final) and winner goes to final battle (1st Place Final)
				const battleIdArray = tournament.battles.map(b => b.id)
				if (
					activeBattle.losers &&
					(battleIdArray.indexOf(activeBattle.id) ===
						battleIdArray.length - 3 ||
						battleIdArray.indexOf(activeBattle.id) === battleIdArray.length - 4)
				) {
					dispatch(setNextTournamentBattleAthlete(activeBattle.losers[0]))
					dispatch(setFinalBattleAthlete(activeBattle.winner))
				} else {
					// else winner moves on
					dispatch(setNextTournamentBattleAthlete(activeBattle.winner))
				}
			}
			// Navigate to tournament home page
			navigate(`/tournament/${tournament.name}/`, {
				state: { updateFirebase: true }
			})
		}
	}

	return (
		<>
			<Head title={title} />
			<NavBar navigation={mainNavigation} />
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
				flexDirection='column'
			>
				<Typography variant='h1'>{tournament.name}</Typography>
				<Typography variant='h2'>{`Battle ${activeBattle.order}`}</Typography>
			</Grid>

			<Container sx={{ p: 4 }}>
				{activeBattle.winner ? (
					<>
						<WinnerView winner={activeBattle.winner} />
						<Grid container sx={{ mt: 4 }}>
							<Grid
								size={12}
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
