import Head from 'components/Common/Head'
import type { ReactElement } from 'react'
import NavBar, { type NavigationItem } from 'components/Common/Navbar'
import Grid from '@mui/material/Grid2'
import { Stack, Typography } from '@mui/material'
import { useAppSelector } from 'app/hooks'
import { selectUserRole } from 'features/auth/authSlice'
import { HOST_ROLE } from 'app/helpers'
import HostView from 'components/Home/Host/HostView'
import SpectatorView from 'components/Home/Spectator/SpectatorView'

export const mainNavigation: NavigationItem[] = [
	{ name: 'Home', href: '/' },
	{ name: 'Login', href: '/login/' },
	{ name: 'Tournament', href: '/tournament/' }
]

export default function HomePage(): ReactElement {
	const userRole = useAppSelector(state => selectUserRole(state))

	return (
		<>
			<Head title='Arena Forge' />
			<NavBar navigation={mainNavigation} />
			<Grid
				container
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h1'>Arena Forge</Typography>
			</Grid>
			<Stack spacing={4} justifyContent='center' padding={4}>
				{userRole === HOST_ROLE ? <HostView /> : <SpectatorView />}
			</Stack>
		</>
	)
}
