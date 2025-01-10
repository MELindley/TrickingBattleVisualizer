import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup
} from '@mui/material'
import {
	TOP_TO_BOTTOM_SEEDING,
	TOP_TO_MIDDLE_SEEDING
} from '../../../../app/helpers'
import type { ChangeEvent, ReactElement } from 'react'
import {
	selectTournamentSeedingMethod,
	setTournamentSeedingMethod
} from '../../../../features/tournament/tournamentSlice'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'

export default function SeedingMethodForm(): ReactElement {
	const seedingDistribution = useAppSelector(state =>
		selectTournamentSeedingMethod(state)
	)
	const dispatch = useAppDispatch()
	const onSeedingMethodChange = (
		event: ChangeEvent<HTMLInputElement>
	): void => {
		if (event.target.value)
			dispatch(setTournamentSeedingMethod(event.target.value))
	}

	return (
		<FormControl>
			<FormLabel id='seeding-row-radio-buttons-group-label'>
				Seeding Distribution
			</FormLabel>
			<RadioGroup
				row
				aria-labelledby='demo-row-radio-buttons-group-label'
				name='row-radio-buttons-group'
				onChange={onSeedingMethodChange}
				value={seedingDistribution}
			>
				<FormControlLabel
					value={TOP_TO_MIDDLE_SEEDING}
					control={<Radio />}
					label='Top to Middle'
				/>
				<FormControlLabel
					value={TOP_TO_BOTTOM_SEEDING}
					control={<Radio />}
					label='Top to Bottom'
				/>
			</RadioGroup>
		</FormControl>
	)
}
