import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import NavBar, { type NavigationItem } from 'components/common/Navbar'
import Grid from '@mui/material/Grid2'
import { Stack, Typography } from '@mui/material'
import { useAppSelector } from 'app/hooks'
import { selectUserRole } from 'features/auth/authSlice'
import { HOST_ROLE } from 'app/helpers'
import HostView from 'components/home/host/HostView'
import SpectatorView from 'components/home/spectator/SpectatorView'

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
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h1'>Arena Forge</Typography>
			</Grid>
			<Stack spacing={4} justifyContent='center' sx={{ p: 4 }}>
				{userRole === HOST_ROLE ? <HostView /> : <SpectatorView />}
			</Stack>
		</>
	)
}
