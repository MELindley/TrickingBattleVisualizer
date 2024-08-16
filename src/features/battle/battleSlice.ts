/* eslint no-param-reassign: 0 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { IAthlete, IBattle } from '../../types'

// Define the initial state using that type
const initialState: IBattle = {
	id: -1,
	athletes: [],
	winner: undefined,
	losers: undefined
}

export const battleSlice = createSlice({
	name: 'battle',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		addAthlete: (state, action: PayloadAction<IAthlete>) => {
			state.athletes.push(action.payload)
		},
		removeAthlete: (state, action: PayloadAction<IAthlete>) => {
			// eslint-disable-next-line no-param-reassign
			state.athletes = state.athletes.filter(a => a?.id !== action.payload.id)
		},
		setAthletes: (state, action: PayloadAction<IAthlete[]>) => {
			// eslint-disable-next-line no-param-reassign
			state.athletes = action.payload
		},
		setWinner: (state, action: PayloadAction<IAthlete>) => {
			state.winner = action.payload
		},
		setLoser: (state, action: PayloadAction<IAthlete[]>) => {
			state.losers = action.payload
		},
		resetBattle: () => initialState
	}
})

export const {
	addAthlete,
	removeAthlete,
	setAthletes,
	setWinner,
	setLoser,
	resetBattle
} = battleSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectBattle = (state: RootState): IBattle => state.battle
export const selectBattleAthletes = (
	state: RootState
): (IAthlete | undefined)[] => state.battle.athletes
export const selectBattleWinner = (state: RootState): IAthlete | undefined =>
	state.battle.winner
export const selectBattleLoser = (state: RootState): IAthlete[] | undefined =>
	state.battle.losers
export const selectBattleIsReady = (state: RootState): boolean =>
	!state.battle.athletes.includes(undefined)

export default battleSlice.reducer
