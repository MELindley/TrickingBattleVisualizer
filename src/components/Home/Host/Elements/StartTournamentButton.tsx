import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material'
import type { ReactElement } from 'react'
import { useState } from 'react'
import Grid from '@mui/material/Grid2'
import { firebaseAddTournamentDocument } from '../../../../api/Tournament/tournamentApi'
import {
	selectTournament,
	setTournament
} from '../../../../features/tournament/tournamentSlice'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { useNavigate } from 'react-router-dom'

export default function StartTournamentButton(): ReactElement {
	const [open, setOpen] = useState(false)
	const tournament = useAppSelector(state => selectTournament(state))
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	const onClickOpen = (): void => {
		setOpen(true)
	}

	const onClickClose = (): void => {
		setOpen(false)
	}

	// @ts-expect-error Handle function must return void
	const onStartTournamentClick = async (): void => {
		window.scrollTo(0, 0)
		const tournamentDocument = await firebaseAddTournamentDocument(tournament)
		dispatch(setTournament(tournamentDocument))
		navigate(`/tournament/${tournament.name}/`)
	}

	return (
		<Grid size={6} display='flex' justifyContent='center' alignItems='center'>
			<Button variant='contained' onClick={onClickOpen}>
				Create Tournament
			</Button>
			<Dialog
				open={open}
				onClose={onClickClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					Create New Tournament ?
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						This will save current options and start the tournament
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClickClose}>Keep Configuring</Button>
					<Button
						variant='contained'
						onClick={onStartTournamentClick}
						autoFocus
					>
						Agree
					</Button>
				</DialogActions>
			</Dialog>
		</Grid>
	)
}
