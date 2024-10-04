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
}

export interface ITournament {
	id: string
	battles: IBattle[]
	winner?: IAthlete
	athletes: IAthlete[]
	name?: string
	hasThirdPlaceBattle?: boolean
	isFinalDifferent?: boolean
}

export interface IFirebaseUserData {
	role: string
}
