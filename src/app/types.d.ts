/* eslint no-shadow: 0 */
/* eslint @typescript-eslint/no-shadow: 0 */

import type { ThemeOptions } from '@mui/material'

export interface IAthlete {
	id: string
	name: string
	surname: string
	image?: {
		color: string
		url: string
	}
	seed?: number
}

export interface IBattle {
	id: string
	athletes: (IAthlete | undefined)[]
	winner?: IAthlete
	losers?: IAthlete[]
	type?: string
	hasRound?: number
	hasTimer?: number
	order: number
}

export interface IBackgroundOptions {
	url: string
}

declare module '@mui/material/styles' {
	// allow configuration using `createTheme()`
	interface ThemeOptions {
		background?: IBackgroundOptions
	}
}

export interface ITournament {
	id: string
	battles: IBattle[]
	winner?: IAthlete
	athletes: IAthlete[]
	name?: string
	hasThirdPlaceBattle?: boolean
	isFinalDifferent?: boolean
	hostUID: string
	themeOptions?: ThemeOptions
}

export interface IFirebaseUserData {
	id: string
	role: string
}
