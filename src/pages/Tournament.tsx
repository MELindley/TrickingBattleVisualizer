import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import NavBar from '../components/common/Navbar'
import Grid from '@mui/material/Unstable_Grid2'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { selectTournamentBattles } from '../features/tournament/tournamentSlice'
import { setActiveBattle } from '../features/battle/battleSlice'
import { mainNavigation } from './Home'
import { Bracket } from 'react-brackets'
import { mapBattleListToReactBracketRoundList } from '../app/helpers'
import CustomSeed from '../components/reactbracket/CustomSeed'

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
				<Bracket
					rounds={mapBattleListToReactBracketRoundList(battleList)}
					renderSeedComponent={CustomSeed}
				/>
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
			</Stack>
		</>
	)
}
