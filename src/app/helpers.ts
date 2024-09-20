import type { IAthlete, IBattle, ITournament } from './types'
import type { DocumentData } from 'firebase/firestore'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import type { User } from 'firebase/auth'
import type { IRoundProps, ISeedProps } from 'react-brackets'

export const HOSTROLE = 'host'
export const SPECTATOR_ROLE = 'spectator'

export const placeHolderTournament: ITournament = {
	id: -1,
	battles: [],
	winner: undefined,
	athletes: []
}

/**
 * Creates a battle instance with specified id and athletes.
 * Optionally, the battle can have rounds and/or a timer.
 *
 * @param {number} id - Unique identifier for the battle.
 * @param {[IAthlete, IAthlete]} athletes - Pair of athletes participating in the battle.
 * @param {number} [hasRound] - Optional number of rounds in the battle.
 * @param {number} [hasTimer] - Optional duration of the timer for the battle.
 * @returns {IBattle} - The created battle object.
 */
const createBattle = (
	id: number,
	athletes: [IAthlete, IAthlete],
	hasRound?: number,
	hasTimer?: number
	// eslint-disable-next-line @typescript-eslint/max-params
): IBattle => {
	const battle: IBattle = { id, athletes }
	if (hasRound !== undefined) {
		battle.hasRound = hasRound
	}
	if (hasTimer !== undefined) {
		battle.hasTimer = hasTimer
	}
	return battle
}

/**
 * Creates a new tournament object.
 *
 * @param {IBattle[]} battles - An array of battle objects to be included in the tournament.
 * @param {IAthlete[]} athletes - An array of athlete objects participating in the tournament.
 * @param {IAthlete} [winner] - (Optional) The athlete who won the tournament.
 * @param {string} [name] - (Optional) The name of the tournament.
 * @returns {ITournament} The newly created tournament object.
 */
// eslint-disable-next-line @typescript-eslint/max-params
/* function buildTournament(

	battles: IBattle[],
	athletes: IAthlete[],
	id?:number,
	winner?: IAthlete,
	name?: string
): ITournament {
	return {
		id:id??0,
		battles,
		winner,
		athletes,
		name
	}
} */

/**
 * Handles the outcome of a battle between two athletes and updates the relevant lists.
 *
 * @param {[IAthlete | null, IAthlete | null]} athletes - The two athletes participating in the battle.
 * @param {IBattle[]} battles - The list of all battles.
 * @param {Array<IAthlete | null | undefined>} nextRoundParticipants - The list of participants for the next round.
 * @param {number} [hasRound] - The current round number (optional).
 * @param {number} [hasTimer] - The timer value for the battle (optional).
 */
const handleBattle = (
	[athlete1, athlete2]: [IAthlete | null, IAthlete | null],
	battles: IBattle[],
	nextRoundParticipants: (IAthlete | null | undefined)[],
	hasRound?: number,
	hasTimer?: number
	// eslint-disable-next-line @typescript-eslint/max-params
): void => {
	if (athlete2 === null) {
		nextRoundParticipants.push(athlete1)
	} else if (athlete1 === null) {
		nextRoundParticipants.push(athlete2)
	} else {
		const battle: IBattle = createBattle(
			battles.length,
			[athlete1, athlete2],
			hasRound,
			hasTimer
		)
		nextRoundParticipants.push(battle.winner)
		battles.push(battle)
	}
}

/**
 * Generates a tournament structure from a list of athletes.
 *
 * @param {IAthlete[]} athletes - An array of athlete objects participating in the tournament.
 * @param {number} [hasRound] - Optional parameter indicating the round number.
 * @param {number} [hasTimer] - Optional parameter indicating the timer value.
 * @returns {ITournament} Returns the constructed tournament.
 */
export const generateTournamentBattlesFromAthletes = (
	athletes: IAthlete[],
	hasRound?: number,
	hasTimer?: number
): IBattle[] => {
	if (athletes.length === 0) {
		return []
	}

	const nextHigherPowerOfTwo = 2 ** Math.ceil(Math.log2(athletes.length))
	const numberOfByes = nextHigherPowerOfTwo - athletes.length
	let participants: (IAthlete | null)[] = [
		...athletes,
		...Array.from<null>({ length: numberOfByes })
	]

	const battles: IBattle[] = []

	while (participants.length > 1) {
		const nextRoundParticipants: (IAthlete | null)[] = []
		const halfLength = participants.length / 2
		const firstHalf = participants.slice(0, halfLength)
		const secondHalf = participants.slice(halfLength).reverse()

		for (const [index, athlete] of firstHalf.entries()) {
			const opponentPair = [athlete, secondHalf[index]] as [
				IAthlete | null,
				IAthlete | null
			]
			handleBattle(
				opponentPair,
				battles,
				nextRoundParticipants,
				hasRound,
				hasTimer
			)
		}

		participants = nextRoundParticipants
	}

	return battles
}

/**
 * Adds a user document to Firebase Firestore.
 *
 * @param {User} user - The user object containing the user's UID.
 * @param {string} role - The role to assign to the user.
 * @return {Promise<void>} A promise that resolves when the user document has been added.
 */
export async function firebaseAddUserDocument(
	user: User,
	role: string
): Promise<void> {
	const userId = user.uid
	const userDocumentReference = doc(firestore, 'users', userId)

	const userData = { role }

	await setDoc(userDocumentReference, userData)
}

/**
 * Retrieves a user document from Firebase Firestore.
 *
 * @param {User} user - The user object containing the user's UID.
 * @return {Promise<DocumentData | undefined>} A promise that resolves to the user document data if it exists, otherwise undefined.
 */
export async function firebaseGetUserDocument(
	user: User
): Promise<DocumentData | undefined> {
	const { uid: userId } = user
	const userDocumentReference = doc(firestore, 'users', userId)
	const userDocumentSnapshot = await getDoc(userDocumentReference)

	return userDocumentSnapshot.exists() ? userDocumentSnapshot.data() : undefined
}

/**
 * Finds the unique element in an array with the highest occurrence.
 * If there is a tie for the highest occurrence, returns undefined.
 *
 * @param {T[]} array - The array of elements to be analyzed.
 * @return {T | undefined} - The unique element with the highest occurrence, or undefined if no single element has the highest occurrence.
 */
export function getUniqueArrayElementWithHighestOccurrence<T>(
	array: T[]
): T | undefined {
	// Create a map to count occurrences of each element
	const elementCount = new Map<T, number>()

	// Count each element's occurrences
	for (const element of array) {
		elementCount.set(element, (elementCount.get(element) ?? 0) + 1)
	}

	// Determine the element with the highest occurrence
	let maxCount = 0
	let maxElement: T | undefined

	for (const [element, count] of elementCount.entries()) {
		if (count > maxCount) {
			maxCount = count
			maxElement = element
		} else if (count === maxCount) {
			maxElement = undefined // More than one element has the max count
		}
	}

	return maxElement
}

/**
 * Calculate the round of a battle in a knock-out tournament using the given battle index and total number of battles.
 *
 * @param {number} battleIndex - The index of the battle in the tournament, starting from 0.
 * @param {number} totalBattleNumber - The total number of battles in the tournament.
 * @return {number} The round number in which the battle takes place.
 */
export function calculateRoundOfBattle(
	battleIndex: number,
	totalBattleNumber: number
): number {
	/**
	 * Formula explanation:
	 *
	 * Using the log base 2 of the ratio of the total number of battles to the remaining battles
	 * after the given battle index. This helps in determining the round number in a knock-out
	 * tournament. For detailed explanation, refer:
	 * https://math.stackexchange.com/questions/2741328/determining-the-round-of-a-match-in-a-knock-out-tournament
	 */
	const remainingBattles = totalBattleNumber - battleIndex
	const ratio = totalBattleNumber / remainingBattles
	const logBase2 = Math.log(2)

	return Math.ceil(Math.log(ratio) / logBase2)
}

/**
 * Returns the title of the round based on the current round index and total number of rounds.
 *
 * @param {number} roundIndex - The current round index (0-based).
 * @param {number} numberOfRounds - The total number of rounds.
 * @return {string} The title of the current round.
 */
function getRoundTitle(roundIndex: number, numberOfRounds: number): string {
	if (roundIndex + 1 === numberOfRounds) return 'Final'
	if (roundIndex + 1 === numberOfRounds - 1) return 'Semi Final'
	return `Round ${roundIndex + 1}`
}

/**
 * Retrieves the list of battles for a specific round.
 *
 * @param {IBattle[]} battleList - The list of all battles.
 * @param {number} athleteSetSize - The number of athletes participating.
 * @param {number} roundIndex - The index of the round to get battles for.
 * @return {IBattle[]} - The list of battles for the specified round.
 */
function getRoundBattles(
	battleList: IBattle[],
	athleteSetSize: number,
	roundIndex: number
): IBattle[] {
	let startIndex = 0
	for (let round = 1; round <= roundIndex; round += 1) {
		startIndex += Math.ceil(athleteSetSize / 2 ** round)
	}
	const endIndex = startIndex + athleteSetSize / 2 ** (roundIndex + 1)
	return battleList.slice(startIndex, endIndex)
}

/**
 * Maps battles to seed props by extracting battle details and constructing
 * necessary seed properties for visual or logical representation.
 *
 * @param {IBattle[]} battles - Array of battle objects to be mapped.
 * @param {IBattle[]} battleList - Complete list of battles to find indexes of battles.
 * @return {ISeedProps[]} - Array of seed properties mapped from the provided battles.
 */
function mapBattlesToSeeds(
	battles: IBattle[],
	battleList: IBattle[]
): ISeedProps[] {
	return battles.map(battle => ({
		id: battleList.indexOf(battle),
		date: new Date().toDateString(),
		teams: battle.athletes.map(athlete =>
			athlete
				? { name: `${athlete.name} ${athlete.surname}`, athlete }
				: { name: '', athlete: undefined }
		)
	}))
}

/**
 * Maps a list of battles to a list of React Bracket round properties.
 *
 * @param {IBattle[]} battleList - The list of battles to be mapped.
 * @return {IRoundProps[]} - The list of round properties for React Bracket.
 */
export function mapBattleListToReactBracketRoundList(
	battleList: IBattle[]
): IRoundProps[] {
	const roundProperties: IRoundProps[] = []
	const numberOfRounds = Math.ceil(Math.log2(battleList.length))
	const athleteSet = new Set<IAthlete>(
		battleList.flatMap(battle =>
			battle.athletes.filter((athlete): athlete is IAthlete => !!athlete)
		)
	)

	for (let roundIndex = 0; roundIndex < numberOfRounds; roundIndex += 1) {
		const title = getRoundTitle(roundIndex, numberOfRounds)
		const roundBattles = getRoundBattles(
			battleList,
			athleteSet.size,
			roundIndex
		)
		const seeds: ISeedProps[] = mapBattlesToSeeds(roundBattles, battleList)

		roundProperties.push({ title, seeds })
	}

	return roundProperties
}
