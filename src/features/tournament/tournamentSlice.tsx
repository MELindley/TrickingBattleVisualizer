/* eslint no-param-reassign: 0 */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { IAthlete, IBattle, ITournament } from '../../types'

// Define the initial state using that type
const initialState: ITournament = {
	id: -1,
	battles: [],
	winner: undefined,
	athletes:[]
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
		setAthletes:(state, action: PayloadAction<IAthlete[]>) => {
			state.athletes = action.payload
		},
		addAthlete:(state, action: PayloadAction<IAthlete>) => {
			state.athletes.push(action.payload)
		},
		resetTournament: () => initialState
	}
})

export const {
	addBattle,
	removeBattle,
	setBattles,
	setWinner,
	setAthletes,
	addAthlete,
	resetTournament
} = tournamentSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTournament = (state: RootState): ITournament =>
	state.tournament
export const selectTournamentAthletes = (state: RootState): IAthlete[] =>
	state.tournament.athletes
export const selectTournamentBattles = (state: RootState): IBattle[] =>
	state.tournament.battles
export const selectTournamentWinner = (state: RootState): IAthlete|undefined =>
	state.tournament.winner
export default tournamentSlice.reducer
