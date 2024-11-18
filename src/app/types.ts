export interface IAthlete {
	id: string
	name: string
	surname: string
	image?: {
		color: string
		url: string
	}
	seeding?: number
}

export interface IBattle {
	id: string
	athletes: (IAthlete | undefined)[]
	winner?: IAthlete
	losers?: IAthlete[]
	hasRound?: number
	hasTimer?: number
	order: number
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
}

export interface IFirebaseUserData {
	id: string
	role: string
}

export interface IBackgroundOptions {
	url: string
}

declare module '@mui/material/styles' {
	interface Theme {
		background: IBackgroundOptions
	}
	// allow configuration using `createTheme()`
	interface ThemeOptions {
		background?: IBackgroundOptions
	}
}
