import Grid from '@mui/material/Grid2'
import { Autocomplete, Stack, TextField, Typography } from '@mui/material'
import type { IAthlete } from 'app/types'
import type { ReactElement, SetStateAction, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import AthleteCard from 'components/athlete/AthleteCard'
import { firebaseGetAthleteCollection } from '../../api/Athlete/athleteApi'
import LoadingOrError from '../common/LoadingOrError'
import AthleteCreationForm from '../athlete/AthleteCreationForm'

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
		value: { label: string; athlete: IAthlete } | null
	): void => {
		if (value) {
			setSelectedAthletes([...selectedAthletes, value.athlete])
		}
	}

	const handleAthleteAdd = (athlete: IAthlete): void => {
		setSelectedAthletes([...selectedAthletes, athlete])
	}

	return (
		<Grid container spacing={4}>
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h3'>Athletes</Typography>
			</Grid>
			<Grid size={6} display='flex' justifyContent='center' alignItems='center'>
				<Stack textAlign='center'>
					<Typography variant='h5'>Select pre-existing athletes</Typography>
					<Autocomplete
						disablePortal
						sx={{ width: 300 }}
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
				</Stack>
			</Grid>
			<Grid size={6} display='flex' justifyContent='center' alignItems='center'>
				<Stack textAlign='center'>
					<Typography variant='h5'>Or add a new Athlete</Typography>
					<AthleteCreationForm callBack={handleAthleteAdd} />
				</Stack>
			</Grid>
			{selectedAthletes.map(athlete => (
				<Grid
					size={{ xs: 6, md: 3 }}
					key={`Selected-Athlete-Card-Grid-${athlete.id}`}
					display='flex'
					justifyContent='center'
					alignItems='center'
				>
					<AthleteCard
						athlete={athlete}
						onCardClick={onAthleteCardClick}
						hasDetailsButton
					/>
				</Grid>
			))}
		</Grid>
	)
}
