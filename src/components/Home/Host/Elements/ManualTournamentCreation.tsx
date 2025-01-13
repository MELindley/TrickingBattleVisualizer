import type { IAthlete, IBattle } from '../../../../app/types'
import AthleteGrid from '../../../Athlete/AthleteGrid'
import { Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import {
	addBattle,
	removeBattle,
	selectTournament
} from '../../../../features/tournament/tournamentSlice'
import { initialBattleState } from '../../../../features/battle/battleSlice'
import type { ReactElement } from 'react'
import { useState } from 'react'

export default function ManualTournamentCreation(): ReactElement {
	const tournament = useAppSelector(state => selectTournament(state))
	const [assignedAthletes, setAssignedAthletes] = useState<IAthlete[]>([])
	const [selectedAthletes, setSelectedAthletes] = useState<IAthlete[]>([])
	const [battle, setBattle] = useState<IBattle>(initialBattleState)
	const [battleCounter, setBattleCounter] = useState<number>(0)
	const dispatch = useAppDispatch()

	const onAddToTournamentClick = (): void => {
		const createdBattle = {
			...battle,
			athletes: selectedAthletes,
			id: battleCounter.toString(),
			order: battleCounter
		}
		setBattle(createdBattle)
		setBattleCounter(battleCounter + 1)
		dispatch(removeBattle(createdBattle))
		dispatch(addBattle(createdBattle))
		setAssignedAthletes([...assignedAthletes, ...selectedAthletes])
		setSelectedAthletes([])
	}

	const onAthleteCardClick = (athlete: IAthlete): void => {
		setSelectedAthletes([...selectedAthletes, athlete])
	}

	return (
		<>
			<AthleteGrid
				athletes={tournament.athletes.filter(
					value => !assignedAthletes.includes(value)
				)}
				onAthleteCardClick={onAthleteCardClick}
				selectedAthletes={selectedAthletes}
			/>
			<Button variant='contained' onClick={onAddToTournamentClick}>
				Add selection to tournament
			</Button>
		</>
	)
}
