import TournamentAthleteConfig from 'components/home/TournamentAthleteConfig'
import TournamentList from 'components/home/TournamentList'
import TournamentBattleConfig from 'components/home/host/TournamentBattleConfig'
import TournamentConfig from 'components/home/host/TournamentConfig'
import ThemeConfig from 'components/home/host/ThemeConfig'
import type { ReactElement, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import type { IAthlete, ITournament } from 'app/types'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import LoadingOrError from 'components/common/LoadingOrError'
import { selectUID } from 'features/auth/authSlice'
import { where } from 'firebase/firestore'
import { AppBar, Box, Tab, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { firebaseGetTournamentsCollection } from '../../../api/Tournament/tournamentApi'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import HorizontalLinearStepper from '../../common/HorizontalStepper'

export default function HostView(): ReactElement {
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const [tournaments, setTournaments] = useState<ITournament[]>([])
	const hostUID = useAppSelector(state => selectUID(state))
	const dispatch = useAppDispatch()
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [tab, setTab] = useState('1')

	useEffect(() => {
		// Add Athletes to athletes list
		const fetchTournaments = async (): Promise<void> => {
			setIsLoading(true)
			try {
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
		if (!isLoading && !isError && tournaments.length === 0) {
			void fetchTournaments()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [dispatch, hostUID, isError, isLoading, tournaments.length])

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
						<Tab label='Call-out Battle' value='3' />
					</TabList>
				</AppBar>
			</Box>
			<TabPanel value='1'>
				<Grid size={12} container justifyContent='center' alignItems='center'>
					<Typography textAlign='center' variant='h3'>
						Create Tournament
					</Typography>
				</Grid>
				<HorizontalLinearStepper
					steps={[
						'Athlete Selection',
						'Battle Configuration',
						'Display Configuration',
						'Tournament Configuration'
					]}
					stepElements={[
						<TournamentAthleteConfig
							selectedAthletes={selectedAthletes}
							setSelectedAthletes={setSelectedAthletes}
							key='tournament-config-step-1'
						/>,
						<TournamentBattleConfig
							selectedAthletes={selectedAthletes}
							key='tournament-config-step-2'
						/>,
						<ThemeConfig key='tournament-config-step-4' />,
						<TournamentConfig
							selectedAthletes={selectedAthletes}
							key='tournament-config-step-3'
						/>
					]}
					optionalSteps={[2]}
				/>
			</TabPanel>
			<TabPanel value='2'>
				<TournamentList tournaments={tournaments} title='Resume Tournament' />
			</TabPanel>
		</TabContext>
	)
}
