import type { IAthlete } from '../../app/types'
import Grid from '@mui/material/Grid2'
import AthleteCard from './AthleteCard'
import type { ReactElement } from 'react'

export interface AthleteGridProperties {
	athletes: IAthlete[]
	selectedAthletes?: IAthlete[]
	onAthleteCardClick: (athlete: IAthlete) => void
}

export default function AthleteGrid({
	athletes,
	selectedAthletes,
	onAthleteCardClick
}: AthleteGridProperties): ReactElement {
	return (
		<>
			{/* eslint-disable-next-line react/destructuring-assignment */}
			{athletes.map(athlete => (
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
						isSelected={
							selectedAthletes?.find(value => value.id === athlete.id) !==
							undefined
						}
					/>
				</Grid>
			))}
		</>
	)
}
