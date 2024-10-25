import type { IAthlete, IBattle, IFirebaseUserData, ITournament } from './types'
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc
} from 'firebase/firestore'
import { firestore } from '../../firebaseConfig'
import type { User } from 'firebase/auth'
import type { IRoundProps, ISeedProps } from '@sportsgram/brackets'

export const HOST_ROLE = 'host'
export const SPECTATOR_ROLE = 'spectator'
/**
 * Creates a battle instance with specified id and athletes.
 * Optionally, the battle can have rounds and/or a timer.
 *
 * @param {number} id - Unique identifier for the battle.
 * @param {[IAthlete, IAthlete]} athletes - Pair of athletes participating in the battle.
 * @param {number} order - Order of the battle in the tournament, -1 for solo battle
 * @param {number} [hasRound] - Optional number of rounds in the battle.
 * @param {number} [hasTimer] - Optional duration of the timer for the battle.
 * @returns {IBattle} - The created battle object.
 */
const createBattle = (
	id: string,
	athletes: [IAthlete | undefined, IAthlete | undefined],
	order: number,
	hasRound?: number,
	hasTimer?: number
	// eslint-disable-next-line @typescript-eslint/max-params
): IBattle => {
	const battle: IBattle = { id, athletes, order }
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
			battles.length.toString(),
			[athlete1, athlete2],
			battles.length,
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
 * @param finalIsDifferent - Optional parameter indicating that the format of the final is different
 * @param hasThirdPlaceBattle - Optional parameter indicating that the tournament has a battle for third place
 * @returns {ITournament} Returns the constructed tournament.
 */
export const generateTournamentBattlesFromAthletes = (
	athletes: IAthlete[],
	hasRound?: number,
	hasTimer?: number,
	finalIsDifferent?: number,
	hasThirdPlaceBattle?: boolean
	// eslint-disable-next-line @typescript-eslint/max-params
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
	if (hasThirdPlaceBattle) {
		// Insert extra battle at the end
		const battle: IBattle = createBattle(
			battles.length.toString(),
			[undefined, undefined],
			battles.length,
			hasRound,
			hasTimer
		)
		battles.push(battle)
	}
	if (finalIsDifferent) {
		const battle = battles.pop() as IBattle
		if (hasTimer) {
			battle.hasTimer = finalIsDifferent
			battles.push(battle)
		}
		if (hasRound) {
			battle.hasRound = finalIsDifferent
			battles.push(battle)
		}
	}

	return battles
}

// Function to sanitize objects before uploading to Firestore
const sanitizeObjectForFirestore = (object: object, removeID = false): object =>
	// Recursively iterate through the object and its nested properties
	// eslint-disable-next-line unicorn/no-array-reduce
	Object.entries(object).reduce<object>((accumulator, [key, value]) => {
		if (typeof value === 'object' && value !== null) {
			// Recursively sanitize nested objects
			// @ts-expect-error is any
			accumulator[key] = sanitizeObjectForFirestore(value as object)
		} else if (value && Array.isArray(value)) {
			// Sanitize array elements
			// @ts-expect-error is any
			accumulator[key] = value.map(item =>
				sanitizeObjectForFirestore(item as object)
			)
		} else if (
			value === undefined ||
			value === null ||
			value === '' ||
			(removeID && key === 'id')
		) {
			// Remove undefined or null values and optionally id keys
		} else {
			// Keep other valid values
			// @ts-expect-error is any
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			accumulator[key] = value
		}
		return accumulator
	}, {})

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
): Promise<IFirebaseUserData> {
	const userId = user.uid
	const userDocumentReference = doc(firestore, 'users', userId)
	const userData = { role }
	await setDoc(userDocumentReference, userData)
	return { id: user.uid, role } as IFirebaseUserData
}

/**
 * Retrieves a user document from Firebase Firestore.
 *
 * @param {User} user - The user object containing the user's UID.
 * @return {Promise<DocumentData | undefined>} A promise that resolves to the user document data if it exists, otherwise undefined.
 */
export async function firebaseGetUserDocument(
	user: User
): Promise<IFirebaseUserData | undefined> {
	const { uid: userId } = user
	const userDocumentReference = doc(firestore, 'users', userId)
	const userDocumentSnapshot = await getDoc(userDocumentReference)
	return userDocumentSnapshot.exists()
		? ({ id: userId, ...userDocumentSnapshot.data() } as IFirebaseUserData)
		: undefined
}

export async function firebaseGetAthleteCollection(): Promise<IAthlete[]> {
	const athletesCollectionReference = collection(firestore, 'athletes')
	const athletesDocuments = await getDocs(athletesCollectionReference)
	const imagesPromises = []
	for (const document of athletesDocuments.docs) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
		imagesPromises.push(getDoc(document.data().image))
	}
	const images = await Promise.all(imagesPromises)
	return athletesDocuments.docs.map(
		(document, index) =>
			({
				id: document.id,
				name: document.data().name as string,
				surname: document.data().surname as string,
				image: images[index].data()
			}) as IAthlete
	)
}

export async function firebaseGetTournamentsCollection(): Promise<
	ITournament[]
> {
	const tournamentsCollectionReference = collection(firestore, 'tournaments')
	const tournamentsDocuments = await getDocs(tournamentsCollectionReference)
	const battlePromises = []
	const athletePromises = []
	// Retrieve athlete & battles Subcollections for each tournament
	for (const document of tournamentsDocuments.docs) {
		// Fetch battles subcollection
		const battlesCollectionReference = collection(document.ref, 'battles')
		battlePromises.push(
			getDocs(battlesCollectionReference).catch((error: unknown) =>
				console.log('Firebase Error:', error)
			)
		)

		// Fetch athletes subcollection
		const athletesCollectionReference = collection(document.ref, 'athletes')
		athletePromises.push(
			getDocs(athletesCollectionReference).catch((error: unknown) =>
				console.log('Firebase Error:', error)
			)
		)
	}
	const battlesSnapshots = await Promise.all(battlePromises)
	const battles = battlesSnapshots.map(
		battlesSnapshot =>
			battlesSnapshot &&
			(battlesSnapshot.docs.map(battleDocument =>
				battleDocument.data()
			) as IBattle[])
	)
	const athltesSnapshots = await Promise.all(athletePromises)
	const athletes = athltesSnapshots.map(
		athletesSnapshot =>
			athletesSnapshot &&
			(athletesSnapshot.docs.map(athleteDocument =>
				athleteDocument.data()
			) as IAthlete[])
	)

	return tournamentsDocuments.docs.map(
		(document, index) =>
			({
				battles: (battles[index] as IBattle[]).sort(
					(a, b) => a.order - b.order
				),
				winner: document.data().winner as IAthlete,
				athletes: athletes[index],
				hasThirdPlaceBattle: document.data().hasThirdPlaceBattle as boolean,
				isFinalDifferent: document.data().isFinalDifferent as boolean,
				hostUID: document.data().hostUID as string,
				id: document.id,
				name: document.data().name as string
			}) as ITournament
	)
}

export async function addAthletesToTournament(
	tournamentId: string,
	athletes: IAthlete[]
): Promise<void> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const athletesCollectionReference = collection(
		tournamentDocumentReference,
		'athletes'
	)
	const athletePromises = []

	for (const athlete of athletes) {
		athletePromises.push(
			addDoc(athletesCollectionReference, sanitizeObjectForFirestore(athlete))
		)
	}
	await Promise.all(athletePromises)
}

export async function addBattlesToTournament(
	tournamentId: string,
	battles: IBattle[]
): Promise<void> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const battlesCollectionReference = collection(
		tournamentDocumentReference,
		'battles'
	)
	const battlePromises = []
	for (const battle of battles) {
		battlePromises.push(
			addDoc(
				battlesCollectionReference,
				sanitizeObjectForFirestore(battle, true)
			)
		)
	}
	await Promise.all(battlePromises)
}

export async function setBattleInTournament(
	tournamentId: string,
	battleId: string,
	updatedBattle: IBattle
): Promise<void> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const battleDocumentReference = doc(
		tournamentDocumentReference,
		'battles',
		battleId
	)

	try {
		await setDoc(
			battleDocumentReference,
			sanitizeObjectForFirestore(updatedBattle)
		)
	} catch (error) {
		console.error('Error updating battle:', error)
	}
}

export async function setAthleteInTournament(
	tournamentId: string,
	athleteId: string,
	updatedAthlete: IAthlete
): Promise<void> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const athleteDocumentReference = doc(
		tournamentDocumentReference,
		'athletes',
		athleteId
	)

	try {
		await setDoc(
			athleteDocumentReference,
			sanitizeObjectForFirestore(updatedAthlete)
		)
		console.log('Athlete updated successfully!')
	} catch (error) {
		console.error('Error updating athlete:', error)
	}
}

export async function firebaseAddTournamentDocument(
	tournament: ITournament
): Promise<void> {
	const tournamentsCollectionReference = collection(firestore, 'tournaments')
	try {
		const tournamentDocumentReference = await addDoc(
			tournamentsCollectionReference,
			sanitizeObjectForFirestore({
				name: tournament.name,
				hasThirdPlaceBattle: tournament.hasThirdPlaceBattle,
				isFinalDifferent: tournament.isFinalDifferent,
				hostUID: tournament.hostUID
			})
		)
		console.log('Tournament created successfully')
		await addAthletesToTournament(
			tournamentDocumentReference.id,
			tournament.athletes
		)
		await addBattlesToTournament(
			tournamentDocumentReference.id,
			tournament.battles
		)
	} catch (error) {
		console.log('Error creating Tournament', error)
	}
}

export async function getAthletesInTournament(
	tournamentId: string
): Promise<IAthlete[]> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const athletesCollectionReference = collection(
		tournamentDocumentReference,
		'athletes'
	)
	const querySnapshot = await getDocs(athletesCollectionReference)
	const athletes: IAthlete[] = []
	// eslint-disable-next-line unicorn/no-array-for-each
	querySnapshot.forEach(athleteDocument => {
		athletes.push(athleteDocument.data() as IAthlete)
	})
	return athletes
}

export async function getBattlesInTournament(
	tournamentId: string
): Promise<IBattle[]> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const battlesCollectionReference = collection(
		tournamentDocumentReference,
		'battles'
	)
	const querySnapshot = await getDocs(battlesCollectionReference)
	const battles: IBattle[] = []
	// eslint-disable-next-line unicorn/no-array-for-each
	querySnapshot.forEach(battleDocument => {
		battles.push(battleDocument.data() as IBattle)
	})
	return battles
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
 * @param hasThirdPlaceBattle - Optional parameter indicating that the tournament has a battle for third place
 * @return {ISeedProps[]} - Array of seed properties mapped from the provided battles.
 */
function mapBattlesToSeeds(
	battles: IBattle[],
	battleList: IBattle[],
	hasThirdPlaceBattle?: boolean
): ISeedProps[] {
	return battles.map(battle => {
		const id = battleList.indexOf(battle)
		const title =
			id === battleList.length - 1
				? 'Grand Final'
				: (id === battleList.length - 2 && hasThirdPlaceBattle
					? 'Third place decider'
					: `Battle ${id + 1}`)
		return {
			id,
			date: new Date().toDateString(),
			teams: battle.athletes.map(athlete =>
				athlete
					? { name: `${athlete.name} ${athlete.surname}`, athlete }
					: { name: '', athlete: undefined }
			),
			title
		}
	})
}

/**
 * Maps a list of battles to a list of React Bracket round properties.
 *
 * @param {ITournament[]} tournament - The tournament to be mapped.
 * @return {IRoundProps[]} - The list of round properties for React Bracket.
 */
export function mapBattleListToReactBracketRoundList(
	tournament: ITournament
): IRoundProps[] {
	const roundProperties: IRoundProps[] = []
	const numberOfRounds = Math.ceil(Math.log2(tournament.battles.length))
	const athleteSet = new Set<IAthlete>(
		tournament.battles.flatMap(battle =>
			battle.athletes.filter((athlete): athlete is IAthlete => !!athlete)
		)
	)

	for (let roundIndex = 0; roundIndex < numberOfRounds; roundIndex += 1) {
		const title = getRoundTitle(roundIndex, numberOfRounds)
		let roundBattles = getRoundBattles(
			tournament.battles,
			athleteSet.size,
			roundIndex
		)
		if (roundIndex === numberOfRounds - 1 && tournament.hasThirdPlaceBattle) {
			// In the final round, include both the final and third place battles
			roundBattles = [...roundBattles, tournament.battles.at(-1) as IBattle]
		}
		const seeds: ISeedProps[] = mapBattlesToSeeds(
			roundBattles,
			tournament.battles,
			tournament.hasThirdPlaceBattle
		)

		roundProperties.push({ title, seeds })
	}

	return roundProperties
}
