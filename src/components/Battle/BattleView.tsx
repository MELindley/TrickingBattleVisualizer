import type { IAthlete, IBattle } from '../../app/types'
import Grid from '@mui/material/Unstable_Grid2'
import { Chip, Slide, Stack, Typography } from '@mui/material'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
import AthleteCard from '../Athlete/AthleteCard'
import { setActiveBattleWinner } from '../../features/battle/battleSlice'
import { useAppDispatch } from '../../app/hooks'
import Countdown from 'react-countdown'
import { getUniqueArrayElementWithHighestOccurence } from '../../app/helpers'

interface Properties {
	battle: IBattle
	hasClickableAthleteCards?: boolean
}

export default function BattleView({
	battle,
	hasClickableAthleteCards
}: Properties): ReactElement {
	const dispatch = useAppDispatch()
	const [isTimerFinished, setIsTimerFinished] = useState(false)
	const [round, setRound] = useState<IAthlete[]>([])

	useEffect(() => {
		if (battle.hasRound && round.length > Math.floor(battle.hasRound / 2)) {
			// Start Checking if we have a winner
			const battleWinner = getUniqueArrayElementWithHighestOccurence(round)
			if (battleWinner) dispatch(setActiveBattleWinner(battleWinner))
		}
	}, [dispatch, battle.hasRound, round])

	const onAthleteCardClick = (athlete: IAthlete): void => {
		if (
			isTimerFinished ||
			(battle.hasRound === undefined && battle.hasTimer === undefined)
		)
			dispatch(setActiveBattleWinner(athlete))
		if (battle.hasRound && round.length < battle.hasRound)
			setRound([...round, athlete])
	}

	const onCountDownStop = (): void => {
		setIsTimerFinished(true)
	}

	const onChipDelete = (index: number): void => {
		setRound(round.toSpliced(index, 1))
	}

	return (
		<Stack spacing={4} justifyContent='center' alignItems='stretch'>
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
										// Card is clickable if hasClickableCards is true and battle is one shot (no timer & no rounds), round based or the timer has finished
										isClickable={
											hasClickableAthleteCards
												? (battle.hasTimer === undefined
													? true
													: isTimerFinished)
												: false
										}
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
			{battle.hasRound && hasClickableAthleteCards ? (
				<>
					<Grid container>
						<Grid
							xs={12}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<Typography variant='h3'>
								Round {round.length + 1} / {battle.hasRound}
							</Typography>
						</Grid>
					</Grid>
					<Grid container>
						{round.map((athlete, index) => (
							<Grid
								xs
								key={`Round-${index + 1}-WinnerChip-${athlete.name}`}
								display='flex'
								justifyContent='center'
								alignItems='center'
							>
								<Chip
									label={`Round ${index + 1} Winner - 	${athlete.name}`}
									color='success'
									onDelete={() => onChipDelete(index)}
								/>
							</Grid>
						))}
					</Grid>
				</>
			) : undefined}
			{battle.hasTimer && hasClickableAthleteCards ? (
				<Grid container>
					<Grid
						xs={12}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						{isTimerFinished ? (
							<Typography variant='h3'>Time !</Typography>
						) : (
							<Countdown
								date={Date.now() + battle.hasTimer}
								onComplete={onCountDownStop}
							/>
						)}
					</Grid>
				</Grid>
			) : undefined}
		</Stack>
	)
}

BattleView.defaultProps = {
	hasClickableAthleteCards: true
}
