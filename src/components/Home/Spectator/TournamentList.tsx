import { Autocomplete, TextField, Typography } from '@mui/material'

import Grid from '@mui/material/Unstable_Grid2'
import type { ReactElement, SyntheticEvent } from 'react'
import type { ITournament } from '../../../app/types'
import { useAppDispatch } from '../../../app/hooks'
import { setTournament } from '../../../features/tournament/tournamentSlice'

interface Properties {
	tournaments: ITournament[]
}

export default function TournamentList({
	tournaments
}: Properties): ReactElement {
	const dispatch = useAppDispatch()

	const onTextFieldChange = (
		event: SyntheticEvent,
		nextValue: ITournament | null
	): void => {
		if (nextValue) dispatch(setTournament(nextValue))
	}

	return (
		<Grid container spacing={4}>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h3'>Select Tournament</Typography>
			</Grid>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Autocomplete
					onChange={onTextFieldChange}
					options={tournaments}
					getOptionLabel={option => option.name ?? ''}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					sx={{ width: 300 }}
					renderInput={parameters => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<TextField {...parameters} label='Tournaments' />
					)}
				/>
			</Grid>
		</Grid>
	)
}
