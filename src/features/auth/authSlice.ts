/* eslint no-param-reassign: 0 */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { IFirebaseUserData } from '../../app/types'

// Define the initial state using that type
const initialState: IFirebaseUserData = {
	role: 'participant'
}

export const authSlice = createSlice({
	name: 'auth',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setUserRole: (state, action: PayloadAction<string>) => {
			state.role = action.payload
		},
		resetAuth: () => initialState
	}
})

export const { setUserRole, resetAuth } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUserRole = (state: RootState): string => state.auth.role

export default authSlice.reducer
