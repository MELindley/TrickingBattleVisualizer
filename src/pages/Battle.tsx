import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import Head from '../components/Head'
import NavBar from '../components/Navbar'
import { mainNavigation } from './Home'
import Grid from '@mui/material/Unstable_Grid2'
import { Container, Slide, Typography } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'
import { selectBattleAthletes } from '../features/battle/battleSlice'
import AthleteBattleCard from '../components/AthleteBattleCard'

export default function BattlePage(): ReactElement {
	const athletesInBattle = useAppSelector((state: RootState) =>
		selectBattleAthletes(state)
	)

	if (athletesInBattle.length === 0) {
		return <Navigate to='/' replace />
	}

	// eslint-disable-next-line unicorn/no-array-reduce
	const title = athletesInBattle.reduce(
		(accumulator, athlete, index) =>
			index === 0
				? accumulator + athlete.name
				: `${accumulator} VS ${athlete.name}`,
		''
	)

	return (
		<>
			<Head title={title} />
			<NavBar navigation={mainNavigation} />
			<Container>
				<Grid container sx={{ mt: 4 }}>
					{athletesInBattle.map((athlete, index) =>
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
			</Container>
		</>
	)
}
