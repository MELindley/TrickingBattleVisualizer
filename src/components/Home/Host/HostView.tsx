import TournamentAthleteConfig from 'components/Home/Host/TournamentAthleteConfig'
import TournamentList from 'components/Home/TournamentList'
import TournamentBattleConfig from 'components/Home/Host/TournamentBattleConfig'
import EventConfig from 'components/Home/Host/EventConfig'
import ThemeConfig from 'components/Home/Host/ThemeConfig'
import type { ReactElement, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import type { ITournament } from 'app/types'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import LoadingOrError from 'components/Common/LoadingOrError'
import { selectUID } from 'features/auth/authSlice'
import { where } from 'firebase/firestore'
import { AppBar, Box, Tab, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { firebaseGetTournamentsCollection } from '../../../api/Tournament/tournamentApi'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import HorizontalLinearStepper from '../../Common/HorizontalStepper'
import StartTournamentButton from './Elements/StartTournamentButton'

export default function HostView(): ReactElement {
	const [existingTournamentsList, setExistingTournamentsList] = useState<
		ITournament[]
	>([])
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
				setExistingTournamentsList(tournamentsData)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}
		if (!isLoading && !isError && existingTournamentsList.length === 0) {
			void fetchTournaments()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [dispatch, hostUID, isError, isLoading, existingTournamentsList.length])

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
						'Tournament Configuration',
						'Display Configuration',
						'Event Configuration'
					]}
					stepElements={[
						<TournamentAthleteConfig key='tournament-config-step-1' />,
						<TournamentBattleConfig key='tournament-config-step-2' />,
						<ThemeConfig key='tournament-config-step-4' />,
						<EventConfig key='tournament-config-step-3' />
					]}
					optionalSteps={[2]}
					renderFinalButtonComponent={<StartTournamentButton />}
				/>
			</TabPanel>
			<TabPanel value='2'>
				<TournamentList
					tournaments={existingTournamentsList}
					title='Resume Tournament'
				/>
			</TabPanel>
		</TabContext>
	)
}
