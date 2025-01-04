import type { IAthlete } from '../../app/types'
import Grid from '@mui/material/Grid2'
import AthleteCard from './AthleteCard'
import type { ReactElement } from 'react'

export interface AthleteGridProperties {
	selectedAthletes: IAthlete[]
	onAthleteCardClick: (athlete: IAthlete) => void
}

export default function AthleteGrid({
	selectedAthletes,
	onAthleteCardClick
}: AthleteGridProperties): ReactElement {
	return (
		<>
			{/* eslint-disable-next-line react/destructuring-assignment */}
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
		</>
	)
}
