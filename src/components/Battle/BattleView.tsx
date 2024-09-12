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
	hasRound?: number
	hasTimer?: number
}

export default function BattleView({
	battle,
	hasClickableAthleteCards,
	hasRound,
	hasTimer
}: Properties): ReactElement {
	const dispatch = useAppDispatch()
	const [isTimerFinished, setIsTimerFinished] = useState(false)
	const [round, setRound] = useState<IAthlete[]>([])

	useEffect(() => {
		if (hasRound && round.length > Math.floor(hasRound / 2)) {
			// Start Checking if we have a winner
			const battleWinner = getUniqueArrayElementWithHighestOccurence(round)
			if (battleWinner) dispatch(setActiveBattleWinner(battleWinner))
		}
	}, [dispatch, hasRound, round])

	const onAthleteCardClick = (athlete: IAthlete): void => {
		if (isTimerFinished || (hasRound === undefined && hasTimer === undefined))
			dispatch(setActiveBattleWinner(athlete))
		if (hasRound && round.length < hasRound) setRound([...round, athlete])
	}

	const onCountDownStop = (): void => {
		setIsTimerFinished(true)
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
												? (hasTimer === undefined
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
			{hasRound ? (
				<>
					<Grid container>
						<Grid
							xs={12}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							<Typography variant='h3'>
								Round {round.length + 1} / {hasRound}
							</Typography>
						</Grid>
					</Grid>
					<Grid container>
						{round.map((athlete, index) => (
							<Grid
								xs
								key={`RoundWinnerChip-${athlete.name}`}
								display='flex'
								justifyContent='center'
								alignItems='center'
							>
								<Chip
									label={`Round ${index + 1} Winner -${athlete.name}`}
									color='success'
								/>
							</Grid>
						))}
					</Grid>
				</>
			) : undefined}
			{hasTimer ? (
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
								date={Date.now() + hasTimer}
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
	hasClickableAthleteCards: true,
	hasRound: undefined,
	hasTimer: undefined
}
