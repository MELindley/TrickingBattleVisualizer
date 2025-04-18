import Grid from '@mui/material/Grid2'
import { Grow, Typography } from '@mui/material'
import type { IAthlete } from 'app/types'
import type { ReactElement } from 'react'
import AthleteCard from 'components/Athlete/AthleteCard'

interface Properties {
	winner: IAthlete
}

export default function WinnerView({ winner }: Properties): ReactElement {
	return (
		<Grid container>
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Typography variant='h1' component='h2'>
					WINNER
				</Typography>
			</Grid>
			<Grid
				size={12}
				display='flex'
				justifyContent='center'
				alignItems='center'
			>
				<Grow in mountOnEnter unmountOnExit>
					<div>
						<AthleteCard athlete={winner} isClickable={false} />
					</div>
				</Grow>
			</Grid>
		</Grid>
	)
}
