import Grid from '@mui/material/Grid2'
import {
	Autocomplete,
	Button,
	Stack,
	TextField,
	Typography
} from '@mui/material'
import type { IAthlete } from 'app/types'
import type { ReactElement, SetStateAction, SyntheticEvent } from 'react'
import { useMemo, useEffect, useState } from 'react'
import { firebaseGetAthleteCollection } from '../../api/Athlete/athleteApi'
import LoadingOrError from '../Common/LoadingOrError'
import AthleteCreationForm from '../Athlete/AthleteCreationForm'
import AthleteGrid from '../Athlete/AthleteGrid'

interface Properties {
	selectedAthletes: IAthlete[]
	setSelectedAthletes: (value: SetStateAction<IAthlete[]>) => void
}

export default function TournamentAthleteConfig({
	selectedAthletes,
	setSelectedAthletes
}: Properties): ReactElement {
	const [existingAthletesList, setExistingAthletesList] = useState<IAthlete[]>(
		[]
	)
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [autocompleteValue, setAutocompleteValue] =
		useState<IAthlete[]>(selectedAthletes)

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
				v => !selectedAthletes.map(s => s.id).includes(v.id)
			),
		[existingAthletesList, selectedAthletes]
	)

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
	}

	const onAthleteCardClick = (athlete: IAthlete): void => {
		// Check if the athlete is in the array of selected athletes
		const index = selectedAthletes.indexOf(athlete)
		if (index >= 0) {
			// if so remove him
			setSelectedAthletes(selectedAthletes.toSpliced(index, 1))
		}
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
		setSelectedAthletes([...new Set([...selectedAthletes, athlete])])
	}

	const onAddAthleteClick = (): void => {
		setSelectedAthletes([
			...new Set([...selectedAthletes, ...autocompleteValue])
		])
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
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
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
				selectedAthletes={selectedAthletes}
				onAthleteCardClick={onAthleteCardClick}
			/>
		</Grid>
	)
}
