/* eslint no-param-reassign: 0 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { IAthlete, IBattle } from '../../types'

// Define a type for the slice state
interface TournamentState {
	battles: IBattle[]
	winner?: IAthlete
}

// Define the initial state using that type
const initialState: TournamentState = {
	battles: [],
	winner: undefined
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
		setWinner: (state, action: PayloadAction<IAthlete>) => {
			state.winner = action.payload
		},
		resetTournament: () => initialState
	}
})

export const {
	addBattle,
	removeBattle,
	setBattles,
	setWinner,
	resetTournament
} = tournamentSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTournament = (state: RootState): TournamentState =>
	state.tournament
export const selectTournamentAthletes = (state: RootState): IAthlete[] =>
	state.tournament.battles.flatMap(battle => battle.athletes)
export default tournamentSlice.reducer
