import { useQuery } from '@tanstack/react-query'
import getAthletes from 'api/getAthletes'
import AthleteCard from 'components/AthleteCard'
import Head from 'components/Head'
import LoadingOrError from 'components/LoadingOrError'
import { type ReactElement, useEffect, useState } from 'react'
import NavBar, { type NavigationItem } from '../components/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
	resetActiveBattle,
	selectActiveBattle,
	setActiveBattleAthletes,
	setActiveBattleId
} from '../features/battle/battleSlice'
import {
	addBattle,
	generateFromAthletes,
	selectTournamentAthletes,
	selectTournamentBattles,
	setTournamentAthletes
} from '../features/tournament/tournamentSlice'
import type { IAthlete } from '../types'

export const mainNavigation: NavigationItem[] = [{ name: 'Home', href: '/' }]

export default function HomePage(): ReactElement {
	const { isPending, isError, error, data } = useQuery({
		queryKey: ['athletes'],
		queryFn: getAthletes
	})
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const tournamentAthletes = useAppSelector(state =>
		selectTournamentAthletes(state)
	)
	const activeBattle = useAppSelector(state => selectActiveBattle(state))
	const battleList = useAppSelector(state => selectTournamentBattles(state))

	useEffect(() => {
		// Clean potential leftovers from previous battle
		dispatch(resetActiveBattle())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		// Add Athletes to athletes list
		if (data) dispatch(setTournamentAthletes(data))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const onStartBattleClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/battle/`)
	}

	const onStartTournamentClick = (): void => {
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/tournament/`)
	}

	const onAddToTournamentClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		dispatch(setActiveBattleId(battleList.length))
		dispatch(addBattle(activeBattle))
	}

	const onGenerateTournamentClick = (): void => {
		dispatch(generateFromAthletes())
	}

	const onAthleteCardClick = (athlete: IAthlete): void => {
		// Check if the athlete is in the array of selected athletes
		const index = selectedAthletes.indexOf(athlete)
		if (index >= 0) {
			// if so remove him
			setSelectedAthletes(selectedAthletes.toSpliced(index, 1))
		} else {
			// Add the athlete to the selected athletes array
			setSelectedAthletes([...selectedAthletes, athlete])
		}
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
							<AthleteCard athlete={athlete} onCardClick={onAthleteCardClick} />
						</Grid>
					))}
				</Grid>
				<Grid container>
					<Grid
						xs={3}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onStartBattleClick}>
							Start Battle
						</Button>
					</Grid>
					<Grid
						xs={3}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onAddToTournamentClick}>
							Add to Tournament
						</Button>
					</Grid>
					<Grid
						xs={3}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onGenerateTournamentClick}>
							Generate tournament
						</Button>
					</Grid>
					<Grid
						xs={3}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onStartTournamentClick}>
							Start Tournament
						</Button>
					</Grid>
				</Grid>
			</Stack>
		</>
	)
}
