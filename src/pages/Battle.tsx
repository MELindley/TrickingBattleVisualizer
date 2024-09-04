import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import Head from '../components/Head'
import NavBar from '../components/Navbar'
import { mainNavigation } from './Home'
import { Container } from '@mui/material'
import { useAppSelector } from '../app/hooks'
import type { RootState } from '../app/store'
import {
	selectBattleAthletes,
	selectBattleWinner
} from '../features/battle/battleSlice'
import BattleView from '../components/Battle/BattleView'
import WinnerView from '../components/Battle/WinnerView'

export default function BattlePage(): ReactElement {
	const athletesInBattle = useAppSelector((state: RootState) =>
		selectBattleAthletes(state)
	)
	const winner = useAppSelector((state: RootState) => selectBattleWinner(state))

	if (athletesInBattle.length === 0) {
		return <Navigate to='/' replace />
	}

	// eslint-disable-next-line unicorn/no-array-reduce
	const title = athletesInBattle.reduce(
		(accumulator, athlete, index) =>
			index === 0
				? accumulator + (athlete?.name ?? 'TBD')
				: `${accumulator} VS ${athlete?.name ?? 'TDB'}`,
		''
	)

	return (
		<>
			<Head title={title} />
			<NavBar navigation={mainNavigation} />
			<Container>
				{winner ? (
					<WinnerView winner={winner} />
				) : (
					<BattleView athletes={athletesInBattle} />
				)}
			</Container>
		</>
	)
}
