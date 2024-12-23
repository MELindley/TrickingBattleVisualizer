import { Autocomplete, Button, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import type { ReactElement, SyntheticEvent } from 'react'
import { useState } from 'react'
import type { ITournament } from 'app/types'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
	initialState,
	setTournament
} from 'features/tournament/tournamentSlice'
import { useNavigate } from 'react-router-dom'
import { selectUserRole } from '../../features/auth/authSlice'
import { HOST_ROLE } from '../../app/helpers'

interface Properties {
	tournaments: ITournament[]
	title?: string
}

export default function TournamentList({
	tournaments,
	title
}: Properties): ReactElement {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	const userRole = useAppSelector(state => selectUserRole(state))
	const [selectedTournament, setSelectedTournament] =
		useState<ITournament>(initialState)

	const onTextFieldChange = (
		event: SyntheticEvent,
		nextValue: ITournament | null
	): void => {
		if (nextValue) {
			setSelectedTournament(nextValue)
			dispatch(setTournament(nextValue))
		}
	}

	function onClick(): void {
		navigate(`/tournament/${selectedTournament.name}/`)
	}

	return (
		<Grid container spacing={4}>
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h3'>{title}</Typography>
			</Grid>
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
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
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Button variant='contained' onClick={onClick}>
					{userRole === HOST_ROLE ? 'Start' : 'View'} Tournament
				</Button>
			</Grid>
		</Grid>
	)
}
TournamentList.defaultProps = {
	title: 'Select Tournament'
}
