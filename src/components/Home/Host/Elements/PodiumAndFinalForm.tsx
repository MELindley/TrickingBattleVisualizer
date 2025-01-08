import Grid from '@mui/material/Grid2'
import { FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import {
	ROUND_BATTLE_TYPE,
	selectActiveBattleType
} from '../../../../features/battle/battleSlice'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
	selectTournament,
	setHasThirdPlaceBattle,
	setIsFinalDifferent
} from '../../../../features/tournament/tournamentSlice'
import type { ChangeEvent, ReactElement } from 'react'
import { useMemo } from 'react'

interface Properties {
	setLastBattleSpec: (value: number | undefined) => void
}

export default function PodiumAndFinalForm({
	setLastBattleSpec
}: Properties): ReactElement {
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(state => selectTournament(state))
	const battleType = useAppSelector(state => selectActiveBattleType(state))
	const onSwitchThirdPlaceBattle = (): void => {
		dispatch(setHasThirdPlaceBattle(!tournament.hasThirdPlaceBattle))
	}

	const onSwitchIsFinaleDifferent = (): void => {
		dispatch(setIsFinalDifferent(!tournament.isFinalDifferent))
	}

	const onLastBattleSetUp = (event: ChangeEvent<HTMLInputElement>): void => {
		setLastBattleSpec(Number(event.target.value))
	}

	const finalIsDifferentDisabled = useMemo(
		() => battleType === undefined,
		[battleType]
	)

	return (
		<>
			<Grid size={12} textAlign='center'>
				<Typography variant='h5' p={2}>
					Podium & finals configuration
				</Typography>
			</Grid>
			<Grid size={6} container justifyContent='right' alignItems='center'>
				<FormControlLabel
					value='hasThirdPlaceBattle'
					control={
						<Switch
							checked={tournament.hasThirdPlaceBattle}
							onChange={onSwitchThirdPlaceBattle}
						/>
					}
					label='Third Place Battle'
					labelPlacement='top'
				/>
			</Grid>
			<Grid size={6} container justifyContent='left' alignItems='center'>
				<FormControlLabel
					value='lastBattleIsDifferent'
					control={
						<Switch
							checked={tournament.isFinalDifferent}
							onChange={onSwitchIsFinaleDifferent}
							disabled={finalIsDifferentDisabled}
						/>
					}
					label='Final battle is different'
					labelPlacement='top'
				/>
				{tournament.isFinalDifferent && battleType ? (
					<TextField
						id='battleType-TextField'
						label={`Last battle ${battleType === ROUND_BATTLE_TYPE ? 'number of rounds' : 'timer'}`}
						onChange={onLastBattleSetUp}
						sx={{ ml: 4 }}
					/>
				) : undefined}
			</Grid>
		</>
	)
}
