/* eslint no-param-reassign: 0 */
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { IAthlete } from '../../types'

// Define a type for the slice state
interface BattleState {
	athletes: IAthlete[]
	winner?: IAthlete
	loser?: IAthlete
}

// Define the initial state using that type
const initialState: BattleState = {
	athletes: []
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
			state.athletes = state.athletes.filter(
				a => a.surname !== action.payload.surname
			)
		},
		setAthletes: (state, action: PayloadAction<IAthlete[]>) => {
			// eslint-disable-next-line no-param-reassign
			state.athletes = action.payload
		},
		setWinner: (state, action: PayloadAction<IAthlete>) => {
			state.winner = action.payload
		},
		setLoser: (state, action: PayloadAction<IAthlete>) => {
			state.loser = action.payload
		}
	}
})

export const { addAthlete, removeAthlete, setAthletes, setWinner, setLoser } =
	battleSlice.actions

// Other code such as selectors can use the imported `RootState` type
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectBattle = (state: RootState): BattleState => state.battle
// eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-function-return-type,@typescript-eslint/ban-ts-comment
export const selectBattleAthletes = (state: RootState): IAthlete[] =>
	state.battle.athletes
export const selectBattleWinner = (state: RootState): IAthlete | undefined =>
	state.battle.winner
export const selectBattleLoser = (state: RootState): IAthlete | undefined =>
	state.battle.loser
export default battleSlice.reducer
