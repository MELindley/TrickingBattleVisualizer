import type { ChangeEvent, ReactElement } from 'react'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControlLabel,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import {
	selectActiveBattle,
	setActiveBattleAthletes,
	setActiveBattleId
} from 'features/battle/battleSlice'
import {
	addBattle,
	generateBattlesFromAthletes,
	selectTournament,
	setHasThirdPlaceBattle,
	setIsFinalDifferent,
	setTournament,
	setTournamentHostUID,
	setTournamentName
} from 'features/tournament/tournamentSlice'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import type { IAthlete } from 'app/types'
import { selectUID } from 'features/auth/authSlice'
import { firebaseAddTournamentDocument } from '../../../api/Tournament/tournamentApi'

interface Properties {
	selectedAthletes: IAthlete[]
}

export default function TournamentConfig({
	selectedAthletes
}: Properties): ReactElement {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const tournament = useAppSelector(state => selectTournament(state))
	const activeBattle = useAppSelector(state => selectActiveBattle(state))
	const hostUID = useAppSelector(state => selectUID(state))
	const [lastBattleSpec, setLastBattleSpec] = useState<number | undefined>()
	const [open, setOpen] = useState(false)

	const onClickOpen = (): void => {
		setOpen(true)
	}

	const onClickClose = (): void => {
		setOpen(false)
	}

	// Assign the current user UID to the hostID field of the Tournament, to be done only once on mount
	useEffect(() => {
		dispatch(setTournamentHostUID(hostUID))
	}, [dispatch, hostUID])

	// @ts-expect-error Handle function must return void
	const onStartTournamentClick = async (): void => {
		window.scrollTo(0, 0)
		const tournamentDocument = await firebaseAddTournamentDocument(tournament)
		dispatch(setTournament(tournamentDocument))
		navigate(`/tournament/${tournament.name}/`)
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
					Tournament Config
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
						<Button onClick={onStartTournamentClick} autoFocus>
							Agree
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
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
					<Typography variant='h4' sx={{ mb: 2 }}>
						Battles
					</Typography>
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
