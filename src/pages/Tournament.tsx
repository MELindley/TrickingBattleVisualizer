import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import NavBar from '../components/common/Navbar'
import { Stack, Typography } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { mainNavigation } from './Home'
import { selectUserRole } from '../features/auth/authSlice'
import { HOST_ROLE } from '../app/helpers'
import TournamentHostView from '../components/tournament/host/TournamentHostView'
import TournamentSpectatorView from '../components/tournament/spectator/TournamentSpectatorView'
import Grid from '@mui/material/Unstable_Grid2'
import { selectTournamentName } from '../features/tournament/tournamentSlice'

export default function TournamentPage(): ReactElement {
	const userRole = useAppSelector(state => selectUserRole(state))
	const tournamentName = useAppSelector(state => selectTournamentName(state))
	return (
		<>
			<Head title='Tricking Battle Visualizer' />
			<NavBar navigation={mainNavigation} />
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h1'>{tournamentName}</Typography>
			</Grid>
			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				{userRole === HOST_ROLE ? (
					<TournamentHostView />
				) : (
					<TournamentSpectatorView />
				)}
			</Stack>
		</>
	)
}
