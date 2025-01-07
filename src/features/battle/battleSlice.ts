/* eslint no-param-reassign: 0 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'
import type { IAthlete, IBattle } from 'app/types'

// Define the initial state using that type
const initialState: IBattle = {
	id: '',
	athletes: [],
	winner: undefined,
	losers: undefined,
	order: -1
}

export const TIMER_BATTLE_TYPE = 'TIMER'
export const ROUND_BATTLE_TYPE = 'ROUNDS'
export const TIMED_ROUND_BATTLE_TYPE = 'TIMED_ROUND'

export const battleSlice = createSlice({
	name: 'battle',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		addAthleteToActiveBattle: (state, action: PayloadAction<IAthlete>) => {
			state.athletes.push(action.payload)
		},
		removeAthleteToActiveBattle: (state, action: PayloadAction<IAthlete>) => {
			// eslint-disable-next-line no-param-reassign
			state.athletes = state.athletes.filter(a => a?.id !== action.payload.id)
		},
		setActiveBattleAthletes: (state, action: PayloadAction<IAthlete[]>) => {
			// eslint-disable-next-line no-param-reassign
			state.athletes = action.payload
		},
		setActiveBattleWinner: (state, action: PayloadAction<IAthlete>) => {
			state.winner = action.payload
			state.losers = state.athletes.filter(
				a => a?.id !== action.payload.id
			) as IAthlete[]
		},
		setActiveBattleLoser: (state, action: PayloadAction<IAthlete[]>) => {
			state.losers = action.payload
		},
		setActiveBattleId: (state, action: PayloadAction<string>) => {
			state.id = action.payload
		},
		setActiveBattleType: (state, action: PayloadAction<string>) => {
			state.type = action.payload
		},
		setActiveBattleHasRound: (state, action: PayloadAction<number>) => {
			state.hasRound = action.payload
			state.type = ROUND_BATTLE_TYPE
		},
		setActiveBattleHasTimer: (state, action: PayloadAction<number>) => {
			state.hasTimer = action.payload
			state.type = TIMER_BATTLE_TYPE
		},
		clearActiveBattleType: state => {
			state.hasTimer = undefined
			state.hasRound = undefined
		},
		resetActiveBattle: () => initialState,
		setActiveBattle: (state, action: PayloadAction<IBattle | undefined>) =>
			action.payload ?? initialState
	}
})

export const {
	addAthleteToActiveBattle,
	removeAthleteToActiveBattle,
	setActiveBattleAthletes,
	setActiveBattleWinner,
	setActiveBattleLoser,
	resetActiveBattle,
	setActiveBattleId,
	setActiveBattle,
	setActiveBattleHasRound,
	setActiveBattleHasTimer,
	clearActiveBattleType,
	setActiveBattleType
} = battleSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectActiveBattle = (state: RootState): IBattle => state.battle
export const selectActiveBattleType = (state: RootState): string | undefined =>
	state.battle.type
export const selectActiveBattleAthletes = (
	state: RootState
): (IAthlete | undefined)[] => state.battle.athletes
export const selectActiveBattleWinner = (
	state: RootState
): IAthlete | undefined => state.battle.winner
export const selectActiveBattleLoser = (
	state: RootState
): IAthlete[] | undefined => state.battle.losers
export const selectActiveBattleIsReady = (state: RootState): boolean =>
	!state.battle.athletes.includes(undefined)
export const selectActiveBattleTimer = (state: RootState): number | undefined =>
	state.battle.hasTimer
export const selectActiveBattleRound = (state: RootState): number | undefined =>
	state.battle.hasRound

export default battleSlice.reducer
