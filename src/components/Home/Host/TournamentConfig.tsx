import type { ChangeEvent, ReactElement } from 'react'
import { useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import { TextField, Typography } from '@mui/material'
import {
	selectTournament,
	setTournamentHostUID,
	setTournamentName
} from 'features/tournament/tournamentSlice'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { selectUID } from 'features/auth/authSlice'

export default function TournamentConfig(): ReactElement {
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(state => selectTournament(state))
	const hostUID = useAppSelector(state => selectUID(state))

	// Assign the current user UID to the hostID field of the Tournament, to be done only once on mount
	useEffect(() => {
		dispatch(setTournamentHostUID(hostUID))
	}, [dispatch, hostUID])

	const onTournamentNameChange = (
		event: ChangeEvent<HTMLInputElement>
	): void => {
		dispatch(setTournamentName(event.target.value))
	}

	return (
		<Grid container rowSpacing={4} sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Tournament Configuration
				</Typography>
			</Grid>
			<Grid size={6} display='flex' justifyContent='center' alignItems='center'>
				<TextField
					id='TournamentName-TextField'
					label='Tournament Name'
					value={tournament.name}
					onChange={onTournamentNameChange}
					sx={{ ml: 4 }}
				/>
			</Grid>
		</Grid>
	)
}
