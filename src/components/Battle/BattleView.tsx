import type { IAthlete } from '../../types'
import Grid from '@mui/material/Unstable_Grid2'
import { Slide, Typography } from '@mui/material'
import AthleteBattleCard from './AthleteBattleCard'
import type { ReactElement } from 'react'

interface Properties {
	athletes: IAthlete[]
}

export default function BattleView({ athletes }: Properties): ReactElement {
	return (
		<Grid container sx={{ mt: 4 }}>
			{athletes.map((athlete, index) =>
				index === 0 ? (
					<Grid
						xs
						key={`AthleteInBattleCardGrid-${athlete.name}`}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Slide direction='right' in mountOnEnter unmountOnExit>
							<div>
								<AthleteBattleCard athlete={athlete} />
							</div>
						</Slide>
					</Grid>
				) : (
					<>
						<Grid
							xs={1}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<Typography variant='h2'>VS</Typography>
						</Grid>
						<Grid
							xs
							key={`AthleteInBattleCardGrid-${athlete.name}`}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<Slide
								direction={index % 2 ? 'left' : 'right'}
								in
								mountOnEnter
								unmountOnExit
							>
								<div>
									<AthleteBattleCard athlete={athlete} />
								</div>
							</Slide>
						</Grid>
					</>
				)
			)}
		</Grid>
	)
}
