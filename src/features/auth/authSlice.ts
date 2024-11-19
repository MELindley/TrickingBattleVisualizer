/* eslint no-param-reassign: 0 */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'
import type { IFirebaseUserData } from 'app/types'
import { SPECTATOR_ROLE } from 'app/helpers'

// Define the initial state using that type
const initialState: IFirebaseUserData = {
	role: SPECTATOR_ROLE,
	id: ''
}

export const authSlice = createSlice({
	name: 'auth',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setUserRole: (state, action: PayloadAction<string>) => {
			state.role = action.payload
		},
		setUID: (state, action: PayloadAction<string>) => {
			state.id = action.payload
		},
		resetAuth: () => initialState,
		setAuth: (state, action: PayloadAction<IFirebaseUserData>) => action.payload
	}
})

export const { setUserRole, setUID, resetAuth, setAuth } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUserRole = (state: RootState): string => state.auth.role
export const selectUID = (state: RootState): string => state.auth.id

export default authSlice.reducer
