import type { IAthlete, IBattle } from '../../types'
import Grid from '@mui/material/Unstable_Grid2'
import { Slide, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import AthleteCard from '../AthleteCard'
import { setActiveBattleWinner } from '../../features/battle/battleSlice'
import { useAppDispatch } from '../../app/hooks'

interface Properties {
	battle: IBattle
	hasClickableAthleteCards?: boolean
}

export default function BattleView({
	battle,
	hasClickableAthleteCards
}: Properties): ReactElement {
	const dispatch = useAppDispatch()
	const onAthleteCardClick = (athlete: IAthlete): void => {
		dispatch(setActiveBattleWinner(athlete))
	}
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
								<AthleteCard
									athlete={athlete}
									onCardClick={onAthleteCardClick}
									isClickable={hasClickableAthleteCards}
								/>
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

BattleView.defaultProps = {
	hasClickableAthleteCards: true
}
