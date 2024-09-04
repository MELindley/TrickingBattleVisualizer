import type { IAthlete, IBattle, ITournament } from '../types'

export const placeHolderTournament: ITournament = {
	id: -1,
	battles: [],
	winner: undefined,
	athletes: []
}

export const generateTournamentFromAthletes = (
	athletes: IAthlete[]
): ITournament => {
	if (athletes.length === 0) {
		return placeHolderTournament
	}
	const battles: IBattle[] = []
	const nextHigherPowerOfTwo = 2 ** Math.ceil(Math.log2(athletes.length))
	const winnerNumberOfByes = nextHigherPowerOfTwo - athletes.length
	let incomingParticipants: (IAthlete | undefined)[] = [
		...athletes,
		...Array.from<undefined>({ length: winnerNumberOfByes })
	]
	while (incomingParticipants.length > 0) {
		const halfLength = incomingParticipants.length / 2
		const first = incomingParticipants.slice(0, halfLength)
		const last = incomingParticipants.slice(halfLength)
		last.reverse()
		const nextRoundParticipant: (IAthlete | undefined)[] = []
		const participantPairs = first.map((athlete, index) => [
			athlete,
			last[index]
		])
		for (const pair of participantPairs) {
			if (pair[1] === undefined) {
				nextRoundParticipant.push(pair[0])
			} else if (pair[0] === undefined) nextRoundParticipant.push(pair[1])
			else {
				const battle = {
					id: battles.length,
					athletes: [pair[0], pair[1]]
				} as IBattle
				nextRoundParticipant.push(battle.winner)
				battles.push(battle)
			}
		}
		incomingParticipants = nextRoundParticipant
	}
	return {
		id: 0,
		battles,
		winner: undefined,
		athletes
	} as ITournament
}
