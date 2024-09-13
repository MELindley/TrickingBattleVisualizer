import type { IAthlete, IBattle, ITournament } from './types'
import type { DocumentData } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import type { User } from 'firebase/auth'
import type { IRoundProps, ISeedProps } from 'react-brackets'

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
					athletes: [pair[0], pair[1]],
					hasRound: 3
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

export function calculateRoundOfBattle(
	battleIndex: number,
	totalBattleNumber: number
): number {
	/* See https://math.stackexchange.com/questions/2741328/determining-the-round-of-a-match-in-a-knock-out-tournament
	 * for explanation of formula
	 */
	return Math.ceil(
		Math.log(totalBattleNumber / (totalBattleNumber - battleIndex)) /
			Math.log(2)
	)
}

export function mapBattleListToReactBracketRoundList(
	battleList: IBattle[]
): IRoundProps[] {
	const roundProperties = new Array<IRoundProps>()
	// See https://math.stackexchange.com/questions/2741328/determining-the-round-of-a-match-in-a-knock-out-tournament
	const numberOfRounds = Math.ceil(Math.log2(battleList.length))
	// Get the list of unique athletes from Battle List
	const athleteSet = new Set<IAthlete>(
		battleList.flatMap(battle =>
			battle.athletes.filter((athlete): athlete is IAthlete => !!athlete)
		)
	)
	// Create seeds for each round of the Tournament
	for (let roundIndex = 0; roundIndex < numberOfRounds; roundIndex += 1) {
		// Round title is either Final, Semi Final, or Round N
		const title =
			roundIndex + 1 === numberOfRounds
				? 'Final'
				: (roundIndex + 1 === numberOfRounds - 1
					? 'Semi Final'
					: `Round ${roundIndex + 1}`)
		// The Battles in this round
		const roundBattles = battleList.slice(
			(roundIndex * athleteSet.size) / 2,
			((roundIndex + 1) * athleteSet.size) / 2
		)
		// console.log(battleList, 'start index',roundIndex*athleteSet.size/2,'end index',(roundIndex+1)*athleteSet.size/2,'round:',roundIndex+1,'Round Battles:',roundBattles)
		const seeds: ISeedProps[] = roundBattles.map(
			battle =>
				({
					id: battleList.indexOf(battle),
					date: new Date().toDateString(),
					teams: battle.athletes.map(athlete =>
						athlete
							? { name: `${athlete.name} ${athlete.surname}` }
							: { name: '' }
					)
				}) as ISeedProps
		)
		roundProperties.push({ title, seeds } as IRoundProps)
	}
	return roundProperties
}
