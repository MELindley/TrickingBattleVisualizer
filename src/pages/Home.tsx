import { useQuery } from '@tanstack/react-query'
import getAthletes from 'api/getAthletes'
import AthleteSelectCard from 'components/AthleteSelectCard'
import Head from 'components/Head'
import LoadingOrError from 'components/LoadingOrError'
import { type ReactElement, useEffect } from 'react'
import NavBar, { type NavigationItem } from '../components/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { resetBattle } from '../features/battle/battleSlice'

export const mainNavigation: NavigationItem[] = [{ name: 'Home', href: '/' }]

export default function HomePage(): ReactElement {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athletes'],
		queryFn: getAthletes
	})
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	useEffect(() => {
		// Clean potential leftovers from previous battle
		dispatch(resetBattle())
	})

	const onStartBattleClick = (): void => {
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/battle/`)
	}

	if (isPending || isError) {
		return <LoadingOrError error={error as Error} />
	}
	return (
		<>
			<Head title='Tricking Battle Visualizer' />

			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				<NavBar navigation={mainNavigation} />
				<Grid container>
					{data.map(athlete => (
						<Grid
							xs={6}
							md={4}
							key={`AthleteCardGrid-${athlete.name}`}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<AthleteSelectCard athlete={athlete} />
						</Grid>
					))}
				</Grid>
				<Grid container>
					<Button
						variant='contained'
						onClick={onStartBattleClick}
						sx={{ margin: 'auto' }}
					>
						Start Battle
					</Button>
				</Grid>
			</Stack>
		</>
	)
}
