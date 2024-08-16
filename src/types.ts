export interface IAthlete {
	id: number
	name: string
	surname: string
	image: {
		author: {
			name: string
			url: string
		}
		color: string
		url: string
	}
}

export interface IBattle {
	id: number
	athletes: (IAthlete | undefined)[]
	winner?: IAthlete
	losers?: IAthlete[]
}

export interface ITournament {
	id: number
	battles: IBattle[]
	winner?: IAthlete
}
