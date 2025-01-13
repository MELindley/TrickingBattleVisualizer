/* eslint no-param-reassign: 0 */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'app/store'
import type {
	IAthlete,
	IBackgroundOptions,
	IBattle,
	ITournament
} from 'app/types'
import { TOP_TO_BOTTOM_SEEDING } from 'app/helpers'
import type { Palette, PaletteOptions, ThemeOptions } from '@mui/material'
import type { TypographyOptions } from '@mui/material/styles/createTypography'

export const initialThemeOptions: ThemeOptions = {
	palette: {
		mode: 'dark',
		primary: {
			main: '#640114'
		},
		secondary: {
			main: '#004836'
		}
	},
	typography: {
		fontFamily: 'Lato',
		h1: {
			fontFamily: 'Barlow'
		},
		h2: {
			fontFamily: 'Barlow'
		},
		h3: {
			fontFamily: 'Barlow'
		},
		h4: {
			fontFamily: 'Barlow'
		},
		h5: {
			fontFamily: 'Barlow'
		},
		h6: {
			fontFamily: 'Barlow'
		}
	},
	background: {
		url: '/ArenaForgeLogo.png'
	}
}

// Define the initial state using that type
export const initialState: ITournament = {
	id: '',
	battles: [],
	winner: undefined,
	athletes: [],
	name: '',
	hasThirdPlaceBattle: false,
	isFinalDifferent: false,
	hostUID: '',
	themeOptions: initialThemeOptions,
	seedingMethod: TOP_TO_BOTTOM_SEEDING
}

export const tournamentSlice = createSlice({
	name: 'tournament',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		addBattle: (state, action: PayloadAction<IBattle>) => {
			state.battles.push(action.payload)
			state.battles.sort((a, b) => a.order - b.order)
		},
		removeBattle: (state, action: PayloadAction<IBattle>) => {
			// eslint-disable-next-line no-param-reassign
			state.battles = state.battles.filter(a => a.id !== action.payload.id)
		},
		setTournamentBattles: (state, action: PayloadAction<IBattle[]>) => {
			// eslint-disable-next-line no-param-reassign
			state.battles = action.payload
		},
		setTournamentWinner: (state, action: PayloadAction<IAthlete>) => {
			state.winner = action.payload
		},
		setTournamentName: (state, action: PayloadAction<string>) => {
			state.name = action.payload
		},
		setTournamentHostUID: (state, action: PayloadAction<string>) => {
			state.hostUID = action.payload
		},
		setTournamentAthletes: (state, action: PayloadAction<IAthlete[]>) => {
			state.athletes = action.payload
		},
		addAthleteToTournament: (state, action: PayloadAction<IAthlete>) => {
			state.athletes.push(action.payload)
		},
		removeAthleteFromTournament: (state, action: PayloadAction<IAthlete>) => {
			const index = state.athletes.findIndex(
				athlete => athlete.id === action.payload.id
			)
			state.athletes.splice(index, 1)
		},
		setTournamentAthleteSeed: (
			state,
			action: PayloadAction<{ athlete: IAthlete; seed: number }>
		) => {
			const index = state.athletes.findIndex(
				athlete => athlete.id === action.payload.athlete.id
			)
			state.athletes[index].seed = action.payload.seed
		},
		updateBattleInTournamentByID: (state, action: PayloadAction<IBattle>) => {
			// find the battle that has the same id as payload and update it with payload value
			state.battles[
				state.battles.findIndex(battle => battle.id === action.payload.id)
			] = action.payload
		},
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-return
		resetTournament: () => initialState,
		setTournament: (state, action: PayloadAction<ITournament>) =>
			action.payload,
		setNextTournamentBattleAthlete: (
			state,
			action: PayloadAction<IAthlete>
		) => {
			const nextBattle = state.battles.find(b => b.athletes.includes(undefined))
			if (nextBattle) {
				const battleIndex = state.battles.findIndex(
					battle => battle.id === nextBattle.id
				)
				// eslint-disable-next-line unicorn/no-useless-undefined
				const athleteIndex = nextBattle.athletes.indexOf(undefined)
				nextBattle.athletes[athleteIndex] = action.payload
				state.battles[battleIndex] = nextBattle
			}
		},
		setFinalBattleAthlete: (state, action: PayloadAction<IAthlete>) => {
			const finalBattle = state.battles.at(-1)
			if (finalBattle) {
				// eslint-disable-next-line unicorn/no-useless-undefined
				const athleteIndex = finalBattle.athletes.indexOf(undefined)
				finalBattle.athletes[athleteIndex] = action.payload
				state.battles[state.battles.length - 1] = finalBattle
			}
		},
		setHasThirdPlaceBattle: (state, action: PayloadAction<boolean>) => {
			state.hasThirdPlaceBattle = action.payload
		},
		setIsFinalDifferent: (state, action: PayloadAction<boolean>) => {
			state.isFinalDifferent = action.payload
		},
		setTournamentId: (state, action: PayloadAction<string>) => {
			state.id = action.payload
		},
		// ======== Theming reducers ========
		setTournamentThemeOptions: (
			state,
			action: PayloadAction<ThemeOptions>
		) => ({ ...state, themeOptions: action.payload }),
		resetTournamentThemeOptions: state => ({
			...state,
			themeOptions: initialThemeOptions
		}),
		setTournamentPaletteOptions: (
			state,
			action: PayloadAction<PaletteOptions>
		) => {
			state.themeOptions = { ...state.themeOptions, palette: action.payload }
		},
		setTournamentPalettePrimaryColor: (
			state,
			action: PayloadAction<string>
		) => {
			state.themeOptions = {
				...state.themeOptions,
				palette: {
					...state.themeOptions?.palette,
					primary: { main: action.payload }
				}
			}
		},
		setTournamentPaletteSecondaryColor: (
			state,
			action: PayloadAction<string>
		) => {
			state.themeOptions = {
				...state.themeOptions,
				palette: {
					...state.themeOptions?.palette,
					secondary: { main: action.payload }
				}
			}
		},
		setTypography: (state, action: PayloadAction<TypographyOptions>) => {
			state.themeOptions = { ...state.themeOptions, typography: action.payload }
		},
		setTournamentTypographyBodyFont: (state, action: PayloadAction<string>) => {
			state.themeOptions = {
				...state.themeOptions,
				typography: {
					...state.themeOptions?.typography,
					fontFamily: action.payload
				}
			}
		},
		setTournamentTypographyHeaderFont: (
			state,
			action: PayloadAction<string>
		) => {
			state.themeOptions = {
				...state.themeOptions,
				typography: {
					...state.themeOptions?.typography,
					h1: {
						fontFamily: action.payload
					},
					h2: {
						fontFamily: action.payload
					},
					h3: {
						fontFamily: action.payload
					},
					h4: {
						fontFamily: action.payload
					},
					h5: {
						fontFamily: action.payload
					},
					h6: {
						fontFamily: action.payload
					}
				}
			}
		},
		setBackground: (state, action: PayloadAction<IBackgroundOptions>) => {
			state.themeOptions = { ...state.themeOptions, background: action.payload }
		},
		setTournamentSeedingMethod: (state, action: PayloadAction<string>) => {
			state.seedingMethod = action.payload
		}
	}
})

export const {
	addBattle,
	removeBattle,
	setTournamentBattles,
	setTournamentWinner,
	setTournamentName,
	setTournamentAthletes,
	addAthleteToTournament,
	removeAthleteFromTournament,
	resetTournament,
	updateBattleInTournamentByID,
	setNextTournamentBattleAthlete,
	setFinalBattleAthlete,
	setIsFinalDifferent,
	setHasThirdPlaceBattle,
	setTournamentHostUID,
	setTournament,
	setTournamentId,
	setTournamentThemeOptions,
	resetTournamentThemeOptions,
	setTournamentPaletteOptions,
	setTypography,
	setBackground,
	setTournamentPalettePrimaryColor,
	setTournamentPaletteSecondaryColor,
	setTournamentTypographyBodyFont,
	setTournamentTypographyHeaderFont,
	setTournamentAthleteSeed,
	setTournamentSeedingMethod
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
export const selectTournamentName = (state: RootState): string | undefined =>
	state.tournament.name
export const selectTournamentThemeOptions = (state: RootState): ThemeOptions =>
	state.tournament.themeOptions ?? initialThemeOptions
export const selectThemePaletteOptions = (
	state: RootState
): PaletteOptions | undefined => state.tournament.themeOptions?.palette
export const selectThemeBackgroundOptions = (
	state: RootState
): IBackgroundOptions | undefined => state.tournament.themeOptions?.background
export const selectThemeTypographyOptions = (
	state: RootState
): TypographyOptions | ((palette: Palette) => TypographyOptions) | undefined =>
	state.tournament.themeOptions?.typography
export const selectTournamentSeedingMethod = (
	state: RootState
): string | undefined => state.tournament.seedingMethod

export default tournamentSlice.reducer
