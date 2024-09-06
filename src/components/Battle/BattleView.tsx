import type { IBattle } from '../../types'
import Grid from '@mui/material/Unstable_Grid2'
import { Slide, Typography } from '@mui/material'
import AthleteBattleCard from './AthleteBattleCard'
import type { ReactElement } from 'react'

interface Properties {
	battle: IBattle
}

export default function BattleView({ battle }: Properties): ReactElement {
	return (
		<Grid container sx={{ mt: 4 }}>
			{battle.athletes.map((athlete, index) => (
				<>
					<Grid
						xs
						key={`AthleteInBattleCardGrid-${athlete?.name}`}
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
								<AthleteBattleCard battle={battle} athlete={athlete} />
							</div>
						</Slide>
					</Grid>
					{index !== battle.athletes.length - 1 && (
						<Grid
							xs={1}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<Typography variant='h2'>VS</Typography>
						</Grid>
					)}
				</>
			))}
		</Grid>
	)
}
