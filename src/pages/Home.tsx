import Head from 'components/Common/Head'
import type { ReactElement } from 'react'
import NavBar, { type NavigationItem } from 'components/Common/Navbar'
import Grid from '@mui/material/Grid2'
import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import { useAppSelector } from 'app/hooks'
import { selectUserRole } from 'features/auth/authSlice'
import { HOST_ROLE } from 'app/helpers'
import HostView from 'components/Home/Host/HostView'
import SpectatorView from 'components/Home/Spectator/SpectatorView'
import SportsEsportsIcon from '@mui/icons-material/SportsEsports'
import SettingsIcon from '@mui/icons-material/Settings'
import PaletteIcon from '@mui/icons-material/Palette'
import EventIcon from '@mui/icons-material/Event'
import LiveTvIcon from '@mui/icons-material/LiveTv'
import VisibilityIcon from '@mui/icons-material/Visibility'
import TopLayer from '../components/Common/TopLayer'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Common/Footer'

export const mainNavigation: NavigationItem[] = [
	{ name: 'Home', href: '/' },
	{ name: 'Login', href: '/login/' },
	{ name: 'Tournament', href: '/tournament/' }
]

const hostFeatures = [
	{
		title: 'Create Athletes',
		icon: <SportsEsportsIcon fontSize='large' />,
		description: 'Select or create athletes for your tournament with ease.'
	},
	{
		title: 'Tournament Configuration',
		icon: <SettingsIcon fontSize='large' />,
		description: 'Customize battle types and set up brackets'
	},
	{
		title: 'Display Customization',
		icon: <PaletteIcon fontSize='large' />,
		description: 'Personalize the tournament visuals to match your brand.'
	},
	{
		title: 'Event Setup',
		icon: <EventIcon fontSize='large' />,
		description: 'Name your event and generate the tournament instantly.'
	}
]
const spectatorFeatures = [
	{
		title: 'Spectate Live Tournaments',
		icon: <LiveTvIcon fontSize='large' />,
		description:
			'Select a tournament to watch live and see the tournament tree update in real-time.'
	},
	{
		title: 'Real-Time Updates',
		icon: <VisibilityIcon fontSize='large' />,
		description:
			'Watch the action unfold with live updates of the tournament bracket.'
	}
]

export default function HomePage(): ReactElement {
	const userRole = useAppSelector(state => selectUserRole(state))
	const navigate = useNavigate()
	return (
		<>
			<Head title='Arena Forge' />
			<NavBar navigation={mainNavigation} />
			<TopLayer
				title='Arena Forge'
				subtitle='The Ultimate Battle Visualization & Tournament Management Tool.'
				callToAction={
					<>
						<Grid container spacing={2} justifyContent='center'>
							<Grid size={12}>
								<SpectatorView />
							</Grid>
						</Grid>
						<Grid size={12} my={2}>
							<Typography variant='h5'>OR</Typography>
						</Grid>
						<Grid size={12}>
							<Button
								variant='contained'
								color='primary'
								size='large'
								onClick={() => navigate(`/login`)}
							>
								Log in as Host
							</Button>
						</Grid>
					</>
				}
				imageUrl='https://static.wixstatic.com/media/43c475_f3a4e833cf2c484ca5c43e34c8da2fc3~mv2.jpg'
			/>
			{userRole === HOST_ROLE ? <HostView /> : undefined}
			<Stack spacing={4} justifyContent='center' padding={4}>
				<Typography
					variant='h4'
					fontWeight='bold'
					gutterBottom
					textAlign='center'
				>
					Key Features
				</Typography>
				<Typography
					variant='h5'
					fontWeight='bold'
					gutterBottom
					textAlign='center'
				>
					Host
				</Typography>
				<Grid size={12} container spacing={4} sx={{ mt: 5 }}>
					{hostFeatures.map(feature => (
						<Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
							<Card sx={{ textAlign: 'center', p: 3 }}>
								{feature.icon}
								<CardContent>
									<Typography variant='h6' fontWeight='bold'>
										{feature.title}
									</Typography>
									<Typography variant='body2' color='textSecondary'>
										{feature.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
				<Typography
					variant='h5'
					fontWeight='bold'
					gutterBottom
					textAlign='center'
				>
					Spectator
				</Typography>
				<Grid
					size={12}
					container
					justifyContent='center'
					spacing={4}
					sx={{ mt: 5 }}
				>
					{spectatorFeatures.map(feature => (
						<Grid size={{ xs: 12, sm: 6, md: 3 }} key={feature.title}>
							<Card sx={{ textAlign: 'center', p: 3 }}>
								{feature.icon}
								<CardContent>
									<Typography variant='h6' fontWeight='bold'>
										{feature.title}
									</Typography>
									<Typography variant='body2' color='textSecondary'>
										{feature.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Stack>
			<Footer />
		</>
	)
}
