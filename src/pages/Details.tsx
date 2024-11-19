import { useQuery } from '@tanstack/react-query'
import Head from 'components/common/Head'
import LoadingOrError from 'components/common/LoadingOrError'
import type { ReactElement } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import getAthletes from 'api/getAthletes'
import NavBar from 'components/common/Navbar'
import { mainNavigation } from './Home'
import Grid from '@mui/material/Unstable_Grid2'
import { Stack, Typography } from '@mui/material'

export default function DetailsPage(): ReactElement {
	const { athleteName } = useParams()

	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athlete'],
		queryFn: getAthletes
	})
	if (isPending || isError) {
		return <LoadingOrError error={error as Error} />
	}

	const athlete = data.find(
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
				<Grid xs={6}>
					<img
						style={{
							position: 'relative',
							backgroundColor: athlete.image?.color
						}}
						src={athlete.image?.url}
						alt={athlete.name}
					/>
				</Grid>
				<Grid xs={6} display='flex' justifyContent='center' alignItems='center'>
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
