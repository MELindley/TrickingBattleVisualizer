import type { ReactElement } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Typography } from '@mui/material'
import {
	selectActiveBattle,
	setActiveBattleAthletes,
	setActiveBattleId
} from '../../../features/battle/battleSlice'
import {
	addBattle,
	generateBattlesFromAthletes,
	selectTournament
} from '../../../features/tournament/tournamentSlice'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import type { IAthlete } from '../../../app/types'

interface Properties {
	selectedAthletes: IAthlete[]
}

export default function TournamentConfig({
	selectedAthletes
}: Properties): ReactElement {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(state => selectTournament(state))
	const activeBattle = useAppSelector(state => selectActiveBattle(state))
	const onStartTournamentClick = (): void => {
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/tournament/${tournament.name}/`)
	}

	const onAddToTournamentClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		dispatch(setActiveBattleId(tournament.battles.length))
		dispatch(addBattle(activeBattle))
	}

	const onGenerateTournamentClick = (): void => {
		dispatch(generateBattlesFromAthletes(activeBattle))
	}

	return (
		<Grid container sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Tournament Config
				</Typography>
			</Grid>
			<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
				<Button variant='contained' onClick={onAddToTournamentClick}>
					Add to Tournament
				</Button>
			</Grid>
			<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
				<Button variant='contained' onClick={onGenerateTournamentClick}>
					Generate tournament
				</Button>
			</Grid>
			<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
				<Button variant='contained' onClick={onStartTournamentClick}>
					Start Tournament
				</Button>
			</Grid>
		</Grid>
	)
}
