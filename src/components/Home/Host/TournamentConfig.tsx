import type { ChangeEvent, ReactElement } from 'react'
import { useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import {
	Button,
	FormControlLabel,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import {
	selectActiveBattle,
	setActiveBattleAthletes,
	setActiveBattleId
} from '../../../features/battle/battleSlice'
import {
	addBattle,
	generateBattlesFromAthletes,
	selectTournament,
	setHasThirdPlaceBattle,
	setIsFinalDifferent
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
	const [lastBattleSpec, setLastBattleSpec] = useState<number | undefined>()

	const onStartTournamentClick = (): void => {
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/tournament/${tournament.name}/`)
	}

	const onAddToTournamentClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		dispatch(setActiveBattleId(tournament.battles.length.toString()))
		dispatch(addBattle(activeBattle))
	}

	const onGenerateTournamentClick = (): void => {
		dispatch(
			generateBattlesFromAthletes({
				battle: activeBattle,
				finalIsDifferent: lastBattleSpec
			})
		)
	}

	const onSwitchThirdPlaceBattle = (): void => {
		dispatch(setHasThirdPlaceBattle(!tournament.hasThirdPlaceBattle))
	}

	const onSwitchIsFinaleDifferent = (): void => {
		dispatch(setIsFinalDifferent(!tournament.isFinalDifferent))
	}

	const onLastBattleSetUp = (event: ChangeEvent<HTMLInputElement>): void => {
		setLastBattleSpec(Number(event.target.value))
	}

	return (
		<Grid container rowSpacing={4} sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
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
			<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
				<FormControlLabel
					value='hasThirdPlaceBattle'
					control={
						<Switch
							color='primary'
							checked={tournament.hasThirdPlaceBattle}
							onChange={onSwitchThirdPlaceBattle}
						/>
					}
					label='Third Place Battle'
					labelPlacement='start'
				/>
			</Grid>
			<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
				<FormControlLabel
					value='lastBattleIsDifferent'
					control={
						<Switch
							color='primary'
							checked={tournament.isFinalDifferent}
							onChange={onSwitchIsFinaleDifferent}
						/>
					}
					label='Final battle is different'
					labelPlacement='start'
				/>
				{tournament.isFinalDifferent ? (
					<TextField
						id='battleType-TextField'
						label='Set last battle'
						onChange={onLastBattleSetUp}
						InputLabelProps={{ sx: { color: 'white' } }}
						sx={{ color: 'white', ml: 4 }}
					/>
				) : undefined}
			</Grid>
		</Grid>
	)
}
