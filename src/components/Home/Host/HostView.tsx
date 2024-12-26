import AthleteConfig from 'components/Home/AthleteConfig'
import TournamentList from 'components/Home/TournamentList'
import BattleConfig from 'components/Home/Host/BattleConfig'
import TournamentConfig from 'components/Home/Host/TournamentConfig'
import ThemeConfig from 'components/Home/Host/ThemeConfig'
import type { ReactElement, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import type { IAthlete, ITournament } from 'app/types'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
	selectTournament,
	setTournamentAthletes
} from 'features/tournament/tournamentSlice'
import LoadingOrError from 'components/common/LoadingOrError'
import { selectUID } from 'features/auth/authSlice'
import { where } from 'firebase/firestore'
import { AppBar, Box, Tab, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { firebaseGetAthleteCollection } from '../../../api/Athlete/athleteApi'
import { firebaseGetTournamentsCollection } from '../../../api/Tournament/tournamentApi'
import { TabList, TabPanel, TabContext } from '@mui/lab'
import HorizontalLinearStepper from '../../common/HorizontalStepper'

export default function HostView(): ReactElement {
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const [tournaments, setTournaments] = useState<ITournament[]>([])
	const tournament = useAppSelector(state => selectTournament(state))
	const hostUID = useAppSelector(state => selectUID(state))
	const dispatch = useAppDispatch()
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [tab, setTab] = useState('1')

	useEffect(() => {
		// Add Athletes to athletes list
		const fetchAthletes = async (): Promise<void> => {
			setIsLoading(true)
			try {
				const athletes = await firebaseGetAthleteCollection()
				dispatch(setTournamentAthletes(athletes))
				const tournamentsData = await firebaseGetTournamentsCollection(
					where('hostUID', '==', hostUID)
				)
				setTournaments(tournamentsData)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}
		if (!isLoading && !isError && tournament.athletes.length === 0) {
			void fetchAthletes()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [dispatch, hostUID, isError, isLoading, tournament.athletes])

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	const onTabChange = (event: SyntheticEvent, value: string): void => {
		setTab(value)
	}

	return (
		<TabContext value={tab}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<AppBar position='static'>
					<TabList
						onChange={onTabChange}
						aria-label='Tournament Host Tabs'
						centered
						textColor='inherit'
					>
						<Tab label='Create Tournament' value='1' />
						<Tab label='Resume Tournament' value='2' />
					</TabList>
				</AppBar>
			</Box>
			<TabPanel value='1'>
				<Grid
					size={12}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<Typography variant='h3'>Create Tournament</Typography>
				</Grid>
				<HorizontalLinearStepper
					steps={[
						'Athlete Selection',
						'Battle Configuration',
						'Tournament Configuration',
						'Display Configuration'
					]}
					stepElements={[
						<AthleteConfig
							athletes={tournament.athletes}
							selectedAthletes={selectedAthletes}
							setSelectedAthletes={setSelectedAthletes}
							key='tournament-config-step-1'
						/>,
						<BattleConfig
							selectedAthletes={selectedAthletes}
							key='tournament-config-step-2'
						/>,
						<TournamentConfig
							selectedAthletes={selectedAthletes}
							key='tournament-config-step-3'
						/>,
						<ThemeConfig key='tournament-config-step-4' />
					]}
					optionalSteps={[3]}
				/>
			</TabPanel>
			<TabPanel value='2'>
				<TournamentList tournaments={tournaments} title='Resume Tournament' />
			</TabPanel>
		</TabContext>
	)
}
