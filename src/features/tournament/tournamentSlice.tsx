/* eslint no-param-reassign: 0 */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { IAthlete, IBattle, ITournament } from '../../app/types'
import { generateTournamentFromAthletes } from '../../app/helpers'

// Define the initial state using that type
const initialState: ITournament = {
	id: -1,
	battles: [],
	winner: undefined,
	athletes: [],
	name: 'Temple Gathering'
}

export const tournamentSlice = createSlice({
	name: 'tournament',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		addBattle: (state, action: PayloadAction<IBattle>) => {
			state.battles.push(action.payload)
		},
		removeBattle: (state, action: PayloadAction<IBattle>) => {
			// eslint-disable-next-line no-param-reassign
			state.battles = state.battles.filter(a => a.id !== action.payload.id)
		},
		setBattles: (state, action: PayloadAction<IBattle[]>) => {
			// eslint-disable-next-line no-param-reassign
			state.battles = action.payload
		},
		setTournamentWinner: (state, action: PayloadAction<IAthlete>) => {
			state.winner = action.payload
		},
		setTournamentName: (state, action: PayloadAction<string>) => {
			state.name = action.payload
		},
		setTournamentAthletes: (state, action: PayloadAction<IAthlete[]>) => {
			state.athletes = action.payload
		},
		addAthleteToTournament: (state, action: PayloadAction<IAthlete>) => {
			state.athletes.push(action.payload)
		},
		updateBattleInTournamentByID: (state, action: PayloadAction<IBattle>) => {
			// find the battle that has the same id as payload and update it with payload value
			state.battles[
				state.battles.findIndex(battle => battle.id === action.payload.id)
			] = action.payload
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
		resetTournament: () => initialState,
		generateFromAthletes: (state, action: PayloadAction<IBattle>) =>
			action.payload.hasRound ?? action.payload.hasTimer
				? generateTournamentFromAthletes(
						state.athletes,
						action.payload.hasRound,
						action.payload.hasTimer
					)
				: generateTournamentFromAthletes(state.athletes),
		setNextTournamentBattleAthlete: (
			state,
			action: PayloadAction<IAthlete>
		) => {
			const nextBattle = state.battles.find(b => b.athletes.includes(undefined))
			if (nextBattle) {
				const battleIndex = state.battles.indexOf(nextBattle)
				// eslint-disable-next-line unicorn/no-useless-undefined
				const athleteIndex = nextBattle.athletes.indexOf(undefined)
				nextBattle.athletes[athleteIndex] = action.payload
				state.battles[battleIndex] = nextBattle
			}
		}
	}
})

export const {
	addBattle,
	removeBattle,
	setBattles,
	setTournamentWinner,
	setTournamentName,
	setTournamentAthletes,
	addAthleteToTournament,
	resetTournament,
	updateBattleInTournamentByID,
	generateFromAthletes,
	setNextTournamentBattleAthlete
} = tournamentSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTournament = (state: RootState): ITournament =>
	state.tournament
export const selectTournamentAthletes = (state: RootState): IAthlete[] =>
	state.tournament.athletes
export const selectTournamentBattles = (state: RootState): IBattle[] =>
	state.tournament.battles
export const selectNextTournamentBattle = (
	state: RootState
): IBattle | undefined =>
	state.tournament.battles.find(b => b.athletes.includes(undefined))
export const selectTournamentWinner = (
	state: RootState
): IAthlete | undefined => state.tournament.winner
export default tournamentSlice.reducer
