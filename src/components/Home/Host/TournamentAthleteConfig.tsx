import Grid from '@mui/material/Grid2'
import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import type { IAthlete } from 'app/types'
import type { ReactElement, SyntheticEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { firebaseGetAthleteCollection } from '../../../api/Athlete/athleteApi'
import LoadingOrError from '../../Common/LoadingOrError'
import AthleteCreationForm from '../../Athlete/AthleteCreationForm'
import AthleteGrid from '../../Athlete/AthleteGrid'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import {
	addAthleteToTournament,
	removeAthleteFromTournament,
	selectTournamentAthletes,
	setTournamentAthletes
} from '../../../features/tournament/tournamentSlice'

export default function TournamentAthleteConfig(): ReactElement {
	const dispatch = useAppDispatch()
	const tournamentAthletes = useAppSelector(state =>
		selectTournamentAthletes(state)
	)
	const [existingAthletesList, setExistingAthletesList] = useState<IAthlete[]>(
		[]
	)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [autocompleteValue, setAutocompleteValue] =
		useState<IAthlete[]>(tournamentAthletes)

	useEffect(() => {
		// Add Athletes to athletes list
		const fetchAthletes = async (): Promise<void> => {
			setIsLoading(true)
			try {
				const firebaseAthleteArray = await firebaseGetAthleteCollection()
				setExistingAthletesList(firebaseAthleteArray)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}
		if (!isLoading && !isError && existingAthletesList.length === 0) {
			void fetchAthletes()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [existingAthletesList.length, isError, isLoading])

	const options = useMemo(
		() =>
			existingAthletesList.filter(
				v => !tournamentAthletes.map(s => s.id).includes(v.id)
			),
		[existingAthletesList, tournamentAthletes]
	)

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	const onAthleteCardClick = (athlete: IAthlete): void => {
		dispatch(removeAthleteFromTournament(athlete))
	}

	const onAthleteSelection = (
		event: SyntheticEvent,
		values: IAthlete[] | undefined
	): void => {
		if (values) {
			setAutocompleteValue(values)
		}
	}

	const handleAthleteAdd = (athlete: IAthlete): void => {
		dispatch(addAthleteToTournament(athlete))
	}

	const onAddAthleteClick = (): void => {
		dispatch(
			setTournamentAthletes([
				...new Set([...tournamentAthletes, ...autocompleteValue])
			])
		)
	}

	return (
		<Grid container spacing={4}>
			<Grid size={12} container justifyContent='center' alignItems='center'>
				<Typography variant='h3' marginBottom={2}>
					Athlete Selection
				</Typography>
			</Grid>
			<Grid size={12} container boxShadow={3} borderRadius={2} padding={4}>
				<Grid
					size={{ xs: 12, lg: 6 }}
					container
					justifyContent='center'
					alignItems='top'
				>
					<Stack textAlign='center' spacing={2}>
						<Typography variant='h5'>Select pre-existing athletes</Typography>
						<Autocomplete
							multiple
							sx={{ width: { xs: 300, xl: 500 } }}
							options={options}
							getOptionLabel={(athlete: IAthlete) =>
								`${athlete.surname} ${athlete.name}`
							}
							onChange={onAthleteSelection}
							filterSelectedOptions
							renderInput={parameters => (
								<TextField
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...parameters}
									label='Select Athletes'
									placeholder='Athletes'
								/>
							)}
						/>
						<Button variant='contained' onClick={onAddAthleteClick}>
							Add To Tournament
						</Button>
					</Stack>
				</Grid>
				<Grid
					size={{ xs: 12, lg: 6 }}
					container
					justifyContent='center'
					alignItems='top'
				>
					<Stack textAlign='center' spacing={2}>
						<Typography variant='h5'>Or create new Athlete</Typography>
						<AthleteCreationForm callBack={handleAthleteAdd} />
					</Stack>
				</Grid>
			</Grid>
			<Grid size={12} container justifyContent='center' alignItems='center'>
				<Stack>
					<Typography variant='h3' textAlign='center'>
						Selected Athletes
					</Typography>
					<Typography variant='subtitle1' textAlign='center'>
						Click to remove
					</Typography>
				</Stack>
			</Grid>
			<AthleteGrid
				athletes={tournamentAthletes}
				onAthleteCardClick={onAthleteCardClick}
			/>
		</Grid>
	)
}
