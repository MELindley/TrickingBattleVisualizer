import type { IAthlete, IBattle, ITournament } from './types'
import type { DocumentData } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import type { User } from 'firebase/auth'

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
	let incomingParticipants: (IAthlete | null | undefined)[] = [
		...athletes,
		...Array.from<null>({ length: winnerNumberOfByes })
	]
	while (incomingParticipants.length > 1) {
		const halfLength = incomingParticipants.length / 2
		const first = incomingParticipants.slice(0, halfLength)
		const last = incomingParticipants.slice(halfLength)
		last.reverse()
		const nextRoundParticipant: (IAthlete | null | undefined)[] = []
		const participantPairs = first.map((athlete, index) => [
			athlete,
			last[index]
		])
		for (const pair of participantPairs) {
			if (pair[1] === null) {
				nextRoundParticipant.push(pair[0])
			} else if (pair[0] === null) {
				nextRoundParticipant.push(pair[1])
			} else {
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

export async function firebaseAddUserDocument(
	user: User,
	role: string
): Promise<void> {
	const userId = user.uid
	await setDoc(doc(firestore, 'users', userId), { role })
}

export async function firebaseGetUserDocument(
	user: User
): Promise<DocumentData | undefined> {
	const userId = user.uid
	const userDocumentReference = doc(firestore, 'users', userId)
	const userDocumentSnapshot = await getDoc(userDocumentReference)
	if (userDocumentSnapshot.exists()) {
		return userDocumentSnapshot.data()
	}
	return undefined
}

export function getUniqueArrayElementWithHighestOccurence<T>(
	array: T[]
): T | undefined {
	// create array of unique value
	const arrayUniqueEntries = [...new Set(array)]
	const entryCount = new Map<T, number>(
		arrayUniqueEntries.map(entry => [entry, 0])
	)
	for (const entry of array) {
		const count = entryCount.get(entry)
		if (count) entryCount.set(entry, count + 1)
		else entryCount.set(entry, 1)
	}
	const maxCount = Math.max(...entryCount.values())
	const entriesWithMaxCount = new Array<T>()
	for (const [key, value] of entryCount.entries()) {
		if (value === maxCount) entriesWithMaxCount.push(key)
	}
	return entriesWithMaxCount.length === 1 ? entriesWithMaxCount[0] : undefined
}
