import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import NavBar from '../components/common/Navbar'
import { Stack } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { mainNavigation } from './Home'
import { selectUserRole } from '../features/auth/authSlice'
import { HOST_ROLE } from '../app/helpers'
import TournamentHostView from '../components/tournament/host/TournamentHostView'
import TournamentSpectatorView from '../components/tournament/spectator/TournamentSpectatorView'

export default function TournamentPage(): ReactElement {
	const userRole = useAppSelector(state => selectUserRole(state))

	return (
		<>
			<Head title='Tricking Battle Visualizer' />
			<NavBar navigation={mainNavigation} />
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
