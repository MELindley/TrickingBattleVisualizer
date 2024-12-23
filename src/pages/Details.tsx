import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import NavBar from 'components/common/Navbar'
import { mainNavigation } from './Home'
import Grid from '@mui/material/Grid2'
import { Stack, Typography } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import { selectTournamentAthletes } from '../features/tournament/tournamentSlice'

export default function DetailsPage(): ReactElement {
	const { athleteName } = useParams()
	const athlete = useAppSelector(state => selectTournamentAthletes(state)).find(
		f => f.name.toLowerCase() === athleteName?.toLowerCase()
	)
	if (!athlete) {
		return <Navigate to='/' replace />
	}

	return (
		<>
			<Head title={athlete.name} />
			<NavBar navigation={mainNavigation} />
			<Grid container direction={{ xs: 'column', md: 'row' }}>
				<Grid size={6}>
					<img
						style={{
							position: 'relative',
							backgroundColor: athlete.image?.color
						}}
						src={athlete.image?.url}
						alt={athlete.name}
					/>
				</Grid>
				<Grid
					size={6}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Stack>
						<Link data-testid='BackLink' to='/' className='flex items-center'>
							<img src='/icons/arrow-left.svg' alt='' className='h-5 w-5' />
							<span className='ml-4 text-xl'>Back</span>
						</Link>
						<Typography variant='h1'>
							{athlete.name} {athlete.surname}
						</Typography>
					</Stack>
				</Grid>
			</Grid>
		</>
	)
}
