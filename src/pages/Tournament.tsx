import Head from 'components/Common/Head'
import type { ReactElement } from 'react'
import NavBar from 'components/Common/Navbar'
import { Stack, Typography } from '@mui/material'
import { useAppSelector } from 'app/hooks'
import { mainNavigation } from './Home'
import { selectUserRole } from 'features/auth/authSlice'
import { HOST_ROLE } from 'app/helpers'
import TournamentHostView from 'components/Tournament/host/TournamentHostView'
import TournamentSpectatorView from 'components/Tournament/spectator/TournamentSpectatorView'
import Grid from '@mui/material/Grid2'
import { selectTournamentName } from 'features/tournament/tournamentSlice'

export default function TournamentPage(): ReactElement {
	const userRole = useAppSelector(state => selectUserRole(state))
	const tournamentName = useAppSelector(state => selectTournamentName(state))
	return (
		<>
			<Head title={tournamentName ?? 'Arena Forge'} />
			<NavBar navigation={mainNavigation} />
			<Grid size={12} container justifyContent='center' alignItems='center'>
				<Typography variant='h1'>{tournamentName}</Typography>
			</Grid>
			<Stack alignItems='center' spacing={4}>
				{userRole === HOST_ROLE ? (
					<TournamentHostView />
				) : (
					<TournamentSpectatorView />
				)}
			</Stack>
		</>
	)
}
