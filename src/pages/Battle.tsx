import type { ReactElement } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Head from '../components/Head'
import NavBar from '../components/Navbar'
import { mainNavigation } from './Home'
import { Button, Container } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'
import {
	selectActiveBattle,
	selectActiveBattleWinner
} from '../features/battle/battleSlice'
import BattleView from '../components/Battle/BattleView'
import WinnerView from '../components/Battle/WinnerView'
import Grid from '@mui/material/Unstable_Grid2'
import {
	selectTournament,
	updateBattleInTournamentByID
} from '../features/tournament/tournamentSlice'

export default function BattlePage(): ReactElement {
	const activeBattle = useAppSelector((state: RootState) =>
		selectActiveBattle(state)
	)
	const tournament = useAppSelector((state: RootState) =>
		selectTournament(state)
	)

	const winner = useAppSelector((state: RootState) =>
		selectActiveBattleWinner(state)
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
		dispatch(updateBattleInTournamentByID(activeBattle))
		// if tournamnt id is
		if (
			tournament.id === -1 ||
			activeBattle.id === -1 ||
			!tournament.battles.some(b => b.id === activeBattle.id)
		) {
			navigate('/')
		} else {
			navigate(`/tournament/`)
		}
	}

	return (
		<>
			<Head title={title} />
			<NavBar navigation={mainNavigation} />
			<Container>
				{winner ? (
					<WinnerView winner={winner} />
				) : (
					<BattleView battle={activeBattle} />
				)}
				<Grid container>
					<Grid
						xs={3}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onContinueClick}>
							Continue
						</Button>
					</Grid>
				</Grid>
			</Container>
		</>
	)
}
