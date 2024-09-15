import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import NavBar from '../components/common/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectTournamentBattles } from '../features/tournament/tournamentSlice'
import BattleView from '../components/battle/BattleView'
import { setActiveBattle } from '../features/battle/battleSlice'
import WinnerView from '../components/battle/WinnerView'
import { mainNavigation } from './Home'
import { Bracket } from 'react-brackets'
import { mapBattleListToReactBracketRoundList } from '../app/helpers'

export default function TournamentPage(): ReactElement {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const battleList = useAppSelector(state => selectTournamentBattles(state))
	useEffect(() => {
		dispatch(
			setActiveBattle(battleList.find(battle => battle.winner === undefined))
		)
	}, [battleList, dispatch])

	const onStartBattleClick = (): void => {
		window.scrollTo(0, 0)
		navigate(`/battle/`)
	}

	return (
		<>
			<Head title='Tricking Battle Visualizer' />

			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				<NavBar navigation={mainNavigation} />
				<Grid container rowSpacing={4}>
					{battleList.map(battle => (
						<Grid
							xs={6}
							md={4}
							key={`BattleViewGrid-${battle.id}`}
							display='flex'
							justifyContent='center'
							alignItems='center'
						>
							{battle.winner ? (
								<WinnerView winner={battle.winner} />
							) : (
								<BattleView battle={battle} hasClickableAthleteCards={false} />
							)}
						</Grid>
					))}
				</Grid>
				<Grid container>
					<Grid
						xs={12}
						display='flex'
						justifyContent='center'
						alignItems='center'
					>
						<Button variant='contained' onClick={onStartBattleClick}>
							{battleList.some(battle => battle.winner === undefined)
								? 'Next Battle'
								: 'Back'}
						</Button>
					</Grid>
				</Grid>
				<Bracket rounds={mapBattleListToReactBracketRoundList(battleList)} />
			</Stack>
		</>
	)
}
