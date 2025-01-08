import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography
} from '@mui/material'
import {
	ROUND_BATTLE_TYPE,
	selectActiveBattleRound,
	selectActiveBattleTimer,
	selectActiveBattleType,
	setActiveBattleHasRound,
	setActiveBattleHasTimer,
	setActiveBattleType,
	TIMER_BATTLE_TYPE
} from '../../../../features/battle/battleSlice'
import type { ChangeEvent, ReactElement } from 'react'
import Grid from '@mui/material/Grid2'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'

export default function BattleTypeForm(): ReactElement {
	const dispatch = useAppDispatch()
	const battleType = useAppSelector(state => selectActiveBattleType(state))
	const battleTimer = useAppSelector(state => selectActiveBattleTimer(state))
	const battleRound = useAppSelector(state => selectActiveBattleRound(state))

	const onBattleTypeChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.value) dispatch(setActiveBattleType(event.target.value))
		else dispatch(setActiveBattleType(undefined))
	}

	const onTextFieldChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (battleType === TIMER_BATTLE_TYPE) {
			dispatch(setActiveBattleHasTimer(Number(event.target.value)))
		} else if (battleType === ROUND_BATTLE_TYPE) {
			dispatch(setActiveBattleHasRound(Number(event.target.value)))
		}
	}

	return (
		<>
			<FormControl>
				<Typography variant='h5' pb={2}>
					Select battle type
				</Typography>
				<RadioGroup
					row
					aria-labelledby='demo-row-radio-buttons-group-label'
					name='row-radio-buttons-group'
					onChange={onBattleTypeChange}
					value={battleType ?? ''}
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
					<FormControlLabel value='' control={<Radio />} label='Open' />
				</RadioGroup>
			</FormControl>
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
						value={
							(battleType === ROUND_BATTLE_TYPE ? battleRound : battleTimer) ??
							0
						}
					/>
				</Grid>
			) : undefined}
		</>
	)
}
