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
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	resetBattle,
	selectBattle,
	setBattleId
} from '../features/battle/battleSlice'
import {
	addBattle,
	generateFromAthletes,
	selectTournamentAthletes,
	selectTournamentBattles,
	setAthletes
} from '../features/tournament/tournamentSlice'

export const mainNavigation: NavigationItem[] = [{ name: 'Home', href: '/' }]

export default function HomePage(): ReactElement {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athletes'],
		queryFn: getAthletes
	})
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const tournamentAthletes = useAppSelector(state =>
		selectTournamentAthletes(state)
	)
	const activeBattle = useAppSelector(state => selectBattle(state))
	const battleList = useAppSelector(state => selectTournamentBattles(state))

	useEffect(() => {
		// Clean potential leftovers from previous battle
		dispatch(resetBattle())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// Add Athletes to athletes list
		if (data) dispatch(setAthletes(data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const onStartBattleClick = (): void => {
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/battle/`)
	}

	const onAddToTournamentClick = (): void => {
		dispatch(setBattleId(battleList.length))
		dispatch(addBattle(activeBattle))
	}

	const onGenerateTournamentClick = (): void => {
		dispatch(generateFromAthletes())
	}

	if (isPending || isError) {
		return <LoadingOrError error={error as Error} />
	}
	return (
		<>
			<Head title='Tricking Battle Visualizer' />

			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				<NavBar navigation={mainNavigation} />
				<Grid container rowSpacing={4}>
					{tournamentAthletes.map(athlete => (
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
					<Grid
						xs={4}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onStartBattleClick}>
							Start Battle
						</Button>
					</Grid>
					<Grid
						xs={4}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onAddToTournamentClick}>
							Add to Tournament
						</Button>
					</Grid>
					<Grid
						xs={4}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onGenerateTournamentClick}>
							Generate tournament
						</Button>
					</Grid>
				</Grid>
			</Stack>
		</>
	)
}
