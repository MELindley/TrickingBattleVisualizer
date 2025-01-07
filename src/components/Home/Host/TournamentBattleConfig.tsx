import Grid from '@mui/material/Grid2'
import {
	Button,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import {
	ROUND_BATTLE_TYPE,
	selectActiveBattle,
	selectActiveBattleRound,
	selectActiveBattleTimer,
	selectActiveBattleType,
	setActiveBattleAthletes,
	setActiveBattleHasRound,
	setActiveBattleHasTimer,
	setActiveBattleId,
	setActiveBattleType,
	TIMER_BATTLE_TYPE
} from 'features/battle/battleSlice'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import type { IAthlete } from 'app/types'
import type { ChangeEvent, ReactElement } from 'react'
import { useState } from 'react'
import {
	addBattle,
	generateBattlesFromAthletes,
	selectTournament,
	setHasThirdPlaceBattle,
	setIsFinalDifferent
} from '../../../features/tournament/tournamentSlice'

interface Properties {
	selectedAthletes: IAthlete[]
}

export default function TournamentBattleConfig({
	selectedAthletes
}: Properties): ReactElement {
	const dispatch = useAppDispatch()
	const activeBattle = useAppSelector(state => selectActiveBattle(state))
	const battleType = useAppSelector(state => selectActiveBattleType(state))
	const battleTimer = useAppSelector(state => selectActiveBattleTimer(state))
	const battleRound = useAppSelector(state => selectActiveBattleRound(state))
	const [lastBattleSpec, setLastBattleSpec] = useState<number | undefined>()
	const tournament = useAppSelector(state => selectTournament(state))

	const onBattleTypeChange = (event: ChangeEvent<HTMLInputElement>): void => {
		dispatch(setActiveBattleType(event.target.value))
	}

	/* USE this code in Call-out-battles
const onStartBattleClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/battle/`)
	} */

	const onTextFieldChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (battleType === TIMER_BATTLE_TYPE) {
			dispatch(setActiveBattleHasTimer(Number(event.target.value)))
		} else if (battleType === ROUND_BATTLE_TYPE) {
			dispatch(setActiveBattleHasRound(Number(event.target.value)))
		}
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
		<Grid container boxShadow={3} borderRadius={2} padding={4}>
			<Grid size={12} container justifyContent='center' alignItems='center'>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Battle Configuration
				</Typography>
			</Grid>
			<Grid
				size={12}
				container
				justifyContent='center'
				alignItems='center'
				textAlign='center'
			>
				<FormControl>
					<Typography variant='h5'>Select battle type</Typography>
					<RadioGroup
						row
						aria-labelledby='demo-row-radio-buttons-group-label'
						name='row-radio-buttons-group'
						onChange={onBattleTypeChange}
						defaultValue={battleType}
					>
						<FormControlLabel
							value={ROUND_BATTLE_TYPE}
							control={<Radio />}
							label='Rounds'
						/>
						<FormControlLabel
							value={TIMER_BATTLE_TYPE}
							control={<Radio />}
							label='Timer'
						/>
						<FormControlLabel
							value={undefined}
							control={<Radio />}
							label='Open'
						/>
					</RadioGroup>
				</FormControl>
			</Grid>
			{battleType ? (
				<Grid
					size={12}
					container
					justifyContent='center'
					alignItems='center'
					textAlign='center'
				>
					<TextField
						id='battleType-TextField'
						label={
							battleType === ROUND_BATTLE_TYPE
								? 'Set number of rounds'
								: `Set battle timer (ms)`
						}
						onChange={onTextFieldChange}
						value={battleType === ROUND_BATTLE_TYPE ? battleRound : battleTimer}
					/>
				</Grid>
			) : undefined}
			<Grid
				size={12}
				container
				sx={{ boxShadow: 3, borderRadius: 2, mt: 2, p: 4 }}
			>
				<Grid
					size={12}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Typography variant='h5'>Create Tournament Tree</Typography>
				</Grid>
				<Grid
					size={6}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Button variant='contained' onClick={onGenerateTournamentClick}>
						Generate Battles From Athletes
					</Button>
				</Grid>
				<Grid
					size={6}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Button variant='contained' onClick={onAddToTournamentClick}>
						Add selection to tournament
					</Button>
				</Grid>
				<Grid
					size={6}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
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
				<Grid
					size={6}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
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
							sx={{ ml: 4 }}
						/>
					) : undefined}
				</Grid>
			</Grid>
		</Grid>
	)
}
