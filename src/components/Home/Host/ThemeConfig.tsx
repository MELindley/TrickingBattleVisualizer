import Grid from '@mui/material/Unstable_Grid2'
import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	TextField,
	Typography
} from '@mui/material'
import {
	clearActiveBattleType,
	setActiveBattleHasRound,
	setActiveBattleHasTimer
} from 'features/battle/battleSlice'
import { useAppDispatch } from 'app/hooks'
import type { ChangeEvent, ReactElement } from 'react'
import { useState } from 'react'

export default function ThemeConfig(): ReactElement {
	const dispatch = useAppDispatch()
	const [battleType, setBattleType] = useState<string>()

	const onBattleTypeChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (event.target.value === 'Open') {
			dispatch(clearActiveBattleType())
		}
		setBattleType(event.target.value)
	}

	const onTextFieldChange = (event: ChangeEvent<HTMLInputElement>): void => {
		if (battleType === 'Timer') {
			dispatch(setActiveBattleHasTimer(Number(event.target.value)))
		} else if (battleType === 'Rounds') {
			dispatch(setActiveBattleHasRound(Number(event.target.value)))
		}
	}

	return (
		<Grid container sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Battle Config
				</Typography>
			</Grid>
			<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
				<FormControl>
					<FormLabel
						id='battle-type-radio-buttons-group-label'
						sx={{ color: 'white' }}
					>
						Battle Type
					</FormLabel>
					<RadioGroup
						row
						aria-labelledby='demo-row-radio-buttons-group-label'
						name='row-radio-buttons-group'
						onChange={onBattleTypeChange}
					>
						<FormControlLabel
							value='Rounds'
							control={<Radio />}
							label='Rounds'
						/>
						<FormControlLabel value='Timer' control={<Radio />} label='Time' />
						<FormControlLabel value='Open' control={<Radio />} label='Open' />
					</RadioGroup>
				</FormControl>
			</Grid>
			{(battleType === 'Timer' || battleType === 'Rounds') && (
				<Grid xs={3} display='flex' justifyContent='center' alignItems='center'>
					<TextField
						id='battleType-TextField'
						label={`Set ${battleType}`}
						onChange={onTextFieldChange}
						InputLabelProps={{ sx: { color: 'white' } }}
						sx={{ color: 'white' }}
					/>
				</Grid>
			)}
		</Grid>
	)
}
