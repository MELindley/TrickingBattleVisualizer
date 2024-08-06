export interface IAthlete {
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
	athletes: IAthlete[]
	winner: IAthlete
	loser: IAthlete
}

export interface ITournament {
	battles: IBattle[]
}
