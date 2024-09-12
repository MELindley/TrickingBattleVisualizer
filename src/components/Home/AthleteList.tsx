import Grid from '@mui/material/Unstable_Grid2'
import { Typography } from '@mui/material'
import type { IAthlete } from '../../app/types'
import type { ReactElement, SetStateAction } from 'react'
import AthleteCard from '../Athlete/AthleteCard'

interface Properties {
	athletes: IAthlete[]
	selectedAthletes: IAthlete[]
	setSelectedAthletes: (value: SetStateAction<IAthlete[]>) => void
}

export default function AthleteList({
	athletes,
	selectedAthletes,
	setSelectedAthletes
}: Properties): ReactElement {
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

	return (
		<Grid container rowSpacing={4} sx={{ boxShadow: 3, borderRadius: 2 }}>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h3'>Athletes</Typography>
			</Grid>
			{athletes.map(athlete => (
				<Grid
					xs={6}
					md={3}
					key={`AthleteCardGrid-${athlete.name}`}
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
