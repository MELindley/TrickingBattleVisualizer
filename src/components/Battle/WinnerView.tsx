import Grid from '@mui/material/Unstable_Grid2'
import { Grow, Typography } from '@mui/material'
import AthleteBattleCard from './AthleteBattleCard'
import type { IAthlete } from '../../types'
import type { ReactElement } from 'react'

interface Properties {
	winner: IAthlete
}

export default function WinnerView({ winner }: Properties): ReactElement {
	return (
		<Grid container>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Typography variant='h1'>WINNER</Typography>
			</Grid>
			<Grid xs={12} display='flex' justifyContent='center' alignItems='center'>
				<Grow in mountOnEnter unmountOnExit>
					<div>
						<AthleteBattleCard athlete={winner} />
					</div>
				</Grow>
			</Grid>
		</Grid>
	)
}
