import Grid from '@mui/material/Grid2'
import { Button, Stack, Typography } from '@mui/material'
import {
	selectActiveBattle,
	setActiveBattleAthletes,
	setActiveBattleId
} from 'features/battle/battleSlice'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import type { IAthlete, IBattle } from 'app/types'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import {
	addBattle,
	generateBattlesFromAthletes,
	selectTournament,
	setTournamentBattles
} from '../../../features/tournament/tournamentSlice'
import { Bracket } from '@sportsgram/brackets'
import {
	createBattle,
	mapBattleListToReactBracketRoundList
} from '../../../app/helpers'
import CustomSeed from '../../Reactbracket/CustomSeed'
import BattleTypeForm from './Elements/BattleTypeForm'
import PodiumAndFinalForm from './Elements/PodiumAndFinalForm'
import SeedingTable from './Elements/SeedingTable'
import SeedingMethodForm from './Elements/SeedingMethodForm'

export default function TournamentBattleConfig(): ReactElement {
	const dispatch = useAppDispatch()
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const activeBattle = useAppSelector(state => selectActiveBattle(state))
	const [lastBattleSpec, setLastBattleSpec] = useState<number | undefined>()
	const tournament = useAppSelector(state => selectTournament(state))
	setSelectedAthletes([])
	/* USE this code in Call-out-battles
const onStartBattleClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		window.scrollTo(0, 0)
		// eslint-disable-next-line unicorn/no-array-reduce
		navigate(`/battle/`)
	} */

	useEffect(() => {
		// Tournament Rounds are the number of stages in the tournament ( eg: 4 (8th, 4th,Semi final, Final rounds), for 16 athletes)
		const numberOfTournamentRounds = Math.ceil(
			Math.log2(tournament.athletes.length)
		)
		// Total number of battles in the tournament
		const numberOfBattles = 2 ** numberOfTournamentRounds

		const battles = Array.from<IBattle>({ length: numberOfBattles })
		dispatch(
			setTournamentBattles(
				battles.map((battle, index) =>
					createBattle(index.toString(), [undefined, undefined], index)
				)
			)
		)
	}, [dispatch, tournament.athletes])

	const onAddToTournamentClick = (): void => {
		dispatch(setActiveBattleAthletes(selectedAthletes))
		dispatch(setActiveBattleId(tournament.battles.length.toString()))
		dispatch(addBattle(activeBattle))
	}

	const onGenerateTournamentClick = (): void => {
		dispatch(
			generateBattlesFromAthletes({
				battle: activeBattle,
				finalIsDifferent: lastBattleSpec
			})
		)
	}

	return (
		<Grid container padding={4}>
			<Grid size={12} container justifyContent='center' alignItems='center'>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Battle Configuration
				</Typography>
			</Grid>
			<Grid container size={12} boxShadow={3} borderRadius={2} padding={4}>
				<Grid
					size={12}
					container
					justifyContent='center'
					alignItems='center'
					textAlign='center'
				>
					<BattleTypeForm />
				</Grid>
				<Grid
					size={12}
					container
					justifyContent='center'
					alignItems='center'
					textAlign='center'
				>
					<PodiumAndFinalForm setLastBattleSpec={setLastBattleSpec} />
				</Grid>
				<Grid size={12} textAlign='center'>
					<Typography variant='h5' p={2}>
						Tournament tree creation
					</Typography>
				</Grid>
				<Grid size={6} container justifyContent='center' alignItems='center'>
					<Grid size={12} textAlign='center'>
						<Stack spacing={2}>
							<Typography variant='h6'>Seeding & Generation</Typography>
							<SeedingTable />
							<Grid
								size={12}
								container
								justifyContent='center'
								alignItems='center'
								textAlign='center'
							>
								<SeedingMethodForm />
							</Grid>
							<Grid container justifyContent='center' alignItems='center'>
								<Button variant='contained' onClick={onGenerateTournamentClick}>
									Generate Battle Tree from Seeds
								</Button>
							</Grid>
						</Stack>
					</Grid>
				</Grid>
				<Grid size={6} container justifyContent='center' alignItems='center'>
					<Grid size={12} textAlign='center'>
						<Typography variant='h6' p={2}>
							Manual creation
						</Typography>
					</Grid>
					<Button variant='contained' onClick={onAddToTournamentClick}>
						Add selection to tournament
					</Button>
				</Grid>
			</Grid>
			<Grid container size={12} padding={4}>
				<Bracket
					rounds={mapBattleListToReactBracketRoundList(tournament)}
					renderSeedComponent={CustomSeed}
					twoSided
					bracketClassName='m-auto w-min'
				/>
			</Grid>
		</Grid>
	)
}
