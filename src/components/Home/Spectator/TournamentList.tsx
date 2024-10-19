import { Autocomplete, TextField, Typography } from '@mui/material'

import Grid from '@mui/material/Unstable_Grid2'
import type { ReactElement, SyntheticEvent } from 'react'
import { useEffect } from 'react'
import type { ITournament } from '../../../app/types'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
	selectTournament,
	setTournament
} from '../../../features/tournament/tournamentSlice'

interface Properties {
	tournaments: ITournament[]
}

export default function TournamentList({
	tournaments
}: Properties): ReactElement {
	const options = tournaments.map(tournament => ({
		label: tournament.name,
		value: tournament
	}))
	const tournament = useAppSelector(state => selectTournament(state))
	const dispatch = useAppDispatch()
	const onTextFieldChange = (
		event: SyntheticEvent,
		nextValue: ITournament | null
	): void => {
		if (nextValue) dispatch(setTournament(options[0].value))
	}

	useEffect(() => {
		dispatch(setTournament(options[0].value))
	}, [dispatch, options])

	return (
		<Grid container spacing={4}>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h3'>Select Tournament</Typography>
			</Grid>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Autocomplete
					value={tournament}
					onChange={onTextFieldChange}
					options={tournaments}
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
