import { IAthlete, IBattle, ITournament } from '../types'

const placeHolderTournament: ITournament = {
	id: -1,
	battles: [],
	winner: undefined,
	athletes:[]
}

const placeHolderAthlete: IAthlete = {
	id: -1,
	name: "",
	surname: "",
	image: {
		author: {
			name: "",
			url: "",
		},
		color: "",
		url: ""
	},
}

const generateTournamentFromAthletes = (athletes:IAthlete[]):ITournament => {
	if (athletes.length === 0) {
		return placeHolderTournament
	}else{
		const battles:IBattle[] = []
		const nextHigherPowerOfTwo =Math.pow(2, Math.ceil(Math.log2(athletes.length)))
		console.log(nextHigherPowerOfTwo)
		const winnerNumberOfByes = nextHigherPowerOfTwo-athletes.length
		console.log(winnerNumberOfByes)
		const incomingParticipants = athletes.concat(Array(winnerNumberOfByes).fill(placeHolderAthlete))
		while(incomingParticipants.length > 0) {
			const half_length = incomingParticipants.length/2
			const first = incomingParticipants.slice(0, half_length)
			const last = incomingParticipants.slice(half_length)
			last.reverse()
			const nextRoundParticipant
		}
	}

	while len(incoming_participants) > 1:
	half_length = int(len(incoming_participants)/2)
	first = incoming_participants[0:half_length]
	last = incoming_participants[half_length:]
	last.reverse()
	next_round_participants = []
	for participant_pair in zip(first, last):
	if participant_pair[1] is None:
		next_round_participants.append(participant_pair[0])
	elif participant_pair[0] is None:
		next_round_participants.append(participant_pair[1])
else:
	match = Match(participant_pair[0], participant_pair[1])
	next_round_participants.append(match.get_winner_participant())
	self.__matches.append(match)
	incoming_participants = next_round_participants
	self.__winner = incoming_participants[0]
}