/* eslint no-param-reassign: 0 */
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import type { Palette, PaletteOptions, ThemeOptions } from '@mui/material'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import type { IBackgroundOptions } from '../../app/types'

// Define the initial state using that type
const initialState: ThemeOptions = {
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
		url: 'https://static.wixstatic.com/media/43c475_f81d2b034b944b048a095881dad7f69f~mv2.png'
	}
}

export const themeSlice = createSlice({
	name: 'theme',
	// `createSlice` will infer the state type from the `initialState` argument
	initialState,
	reducers: {
		setPalette: (state, action: PayloadAction<PaletteOptions>) => {
			state.palette = action.payload
		},
		setTypography: (state, action: PayloadAction<TypographyOptions>) => {
			state.typography = action.payload
		},
		setBackground: (state, action: PayloadAction<IBackgroundOptions>) => {
			state.background = action.payload
		},
		resetTheme: () => initialState
	}
})

export const { setPalette, setTypography, setBackground, resetTheme } =
	themeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectThemeOptions = (state: RootState): ThemeOptions =>
	state.theme
export const selectThemePaletteOptions = (
	state: RootState
): PaletteOptions | undefined => state.theme.palette
export const selectThemeBackgroundOptions = (
	state: RootState
): IBackgroundOptions | undefined => state.theme.background
export const selectThemeTypographyOptions = (
	state: RootState
): TypographyOptions | ((palette: Palette) => TypographyOptions) | undefined =>
	state.theme.typography

export default themeSlice.reducer
