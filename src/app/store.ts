import { configureStore } from '@reduxjs/toolkit'
import battleReducer from '../features/battle/battleSlice'
import tournamentReducer from '../features/tournament/tournamentSlice'

export const store = configureStore({
	reducer: {
		battle: battleReducer,
		tournament: tournamentReducer
	}
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
