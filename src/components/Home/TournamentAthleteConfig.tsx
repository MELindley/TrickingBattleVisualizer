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
import { useEffect, useState } from 'react'
import { firebaseGetAthleteCollection } from '../../api/Athlete/athleteApi'
import LoadingOrError from '../common/LoadingOrError'
import AthleteCreationForm from '../athlete/AthleteCreationForm'
import AthleteGrid from '../athlete/AthleteGrid'

interface Properties {
	selectedAthletes: IAthlete[]
	setSelectedAthletes: (value: SetStateAction<IAthlete[]>) => void
}

export default function TournamentAthleteConfig({
	selectedAthletes,
	setSelectedAthletes
}: Properties): ReactElement {
	const [athletes, setAthletes] = useState<IAthlete[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()
	const [autocompleteValue, setAutocompleteValue] = useState<IAthlete[]>([])

	useEffect(() => {
		// Add Athletes to athletes list
		const fetchAthletes = async (): Promise<void> => {
			setIsLoading(true)
			try {
				const firebaseAthleteArray = await firebaseGetAthleteCollection()
				setAthletes(firebaseAthleteArray)
			} catch (error) {
				setIsError(error)
			} finally {
				setIsLoading(false)
			}
		}
		if (!isLoading && !isError && athletes.length === 0) {
			void fetchAthletes()
		}
		if (isError) {
			// Wait 1min  and retry, avoid spamming Firebase
			setTimeout(() => {
				setIsError(false)
			}, 60_000)
		}
	}, [athletes.length, isError, isLoading])

	if (isLoading || isError) {
		return <LoadingOrError error={isError as Error} />
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

	const onAthleteSelection = (
		event: SyntheticEvent,
		values: { label: string; athlete: IAthlete }[] | undefined
	): void => {
		if (values) {
			setAutocompleteValue([
				...autocompleteValue,
				...values.map(value => value.athlete)
			])
		}
	}

	const handleAthleteAdd = (athlete: IAthlete): void => {
		setSelectedAthletes([...selectedAthletes, athlete])
	}

	const onAddAthleteClick = (): void => {
		setSelectedAthletes([
			...new Set([...selectedAthletes, ...autocompleteValue])
		])
	}

	return (
		<Grid container spacing={4}>
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
						disablePortal
						sx={{ width: { xs: 300, xl: 500 } }}
						onChange={onAthleteSelection}
						options={athletes.map(athlete => ({
							athlete,
							label: `${athlete.surname} ${athlete.name}`
						}))}
						renderInput={parameters => (
							// eslint-disable-next-line react/jsx-props-no-spreading
							<TextField {...parameters} label='Athletes' />
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
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h3' textAlign='center'>
					Selected Athletes
				</Typography>
			</Grid>
			<AthleteGrid
				selectedAthletes={selectedAthletes}
				onAthleteCardClick={onAthleteCardClick}
			/>
		</Grid>
	)
}
