import type { IAthlete, IBattle, ITournament } from './types'
import type { IRoundProps, ISeedProps } from '@sportsgram/brackets'

export const HOST_ROLE = 'host'
export const SPECTATOR_ROLE = 'spectator'
export const TOP_TO_MIDDLE_SEEDING = 'TOP_TO_MIDDLE_SEEDING'
export const TOP_TO_BOTTOM_SEEDING = 'TOP_TO_BOTTOM_SEEDING'
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
export const createBattle = (
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

export function shuffleArray(n: number): number[] {
	// Create an array from 1 to n
	const array = Array.from({ length: n }, (_, index) => index + 1)

	// Fisher-Yates shuffle
	for (let index = array.length - 1; index > 0; index -= 1) {
		const secondIndex = Math.floor(Math.random() * (index + 1)) // Get a random index
		;[array[index], array[secondIndex]] = [array[secondIndex], array[index]] // Swap elements
	}

	return array
}

function sortArrayForTournament<Type>(array: Type[]): Type[] {
	const orderedArray: Type[] = []
	let battlesInRound = Math.ceil(Math.log2(array.length))
	const evenArray = array.filter((_, index) => index % 2 === 0)
	const oddArray = array.filter((_, index) => index % 2 !== 0)
	while (evenArray.length > 0 || oddArray.length > 0) {
		const roundEvens = evenArray.splice(0, battlesInRound)
		const roundOdds = oddArray.splice(0, battlesInRound)
		orderedArray.push(...roundEvens, ...roundOdds)
		battlesInRound = Math.ceil(Math.log2(battlesInRound)) || 1
	}
	return orderedArray
}

/**
 * Generates a tournament structure from a list of athletes.
 *
 * @param {IAthlete[]} athletes - An array of athlete objects participating in the tournament.
 * @param {number} [hasRound] - Optional parameter indicating the round number.
 * @param {number} [hasTimer] - Optional parameter indicating the timer value.
 * @param finalIsDifferent - Optional parameter indicating that the format of the final is different
 * @param hasThirdPlaceBattle - Optional parameter indicating that the tournament has a battle for third place
 * @param seeedingMethod - Optional parameter indicating the seeding method to use
 * @returns {ITournament} Returns the constructed tournament.
 */
export const generateTournamentBattlesFromAthletes = (
	athletes: IAthlete[],
	hasRound?: number,
	hasTimer?: number,
	finalIsDifferent?: number,
	hasThirdPlaceBattle?: boolean,
	seeedingMethod?: string
	// eslint-disable-next-line @typescript-eslint/max-params
): IBattle[] => {
	if (athletes.length === 0) {
		return []
	}

	// Tournament Rounds are the number of stages in the tournament ( eg: 4 (8th, 4th,Semi final, Final rounds), for 16 athletes)
	const numberOfTournamentRounds = Math.ceil(Math.log2(athletes.length))
	// Total number of battles in the tournament
	const numberOfBattles =
		2 ** numberOfTournamentRounds + (hasThirdPlaceBattle ? 0 : -1)
	// In sports, bye refers to a team automatically advancing to the next round of tournament play without competing
	const numberOfByes = numberOfBattles - athletes.length

	// Sort participants by seed and add nulls to simulate bye
	let participants: (IAthlete | null)[] = [
		...[...athletes].sort((a, b) => {
			if (a.seed && b.seed) return a.seed - b.seed
			return 0
		}),
		...Array.from<null>({ length: numberOfByes })
	]

	const battles: IBattle[] = []

	while (participants.length > 1) {
		const nextRoundParticipants: (IAthlete | null)[] = []
		const halfLength = participants.length / 2
		const firstHalf = participants.slice(0, halfLength)
		const secondHalf = participants.slice(halfLength)

		if (seeedingMethod === TOP_TO_BOTTOM_SEEDING) secondHalf.reverse()

		// Generate all battles
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
	// We now need to put the battles in order for 1 & 2 to be at opposites sides of the bracket
	return sortArrayForTournament(battles)
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
	const numberOfTournamentRounds = Math.ceil(
		Math.log2(tournament.athletes.length)
	)
	const { athletes, battles, hasThirdPlaceBattle } = tournament

	for (
		let roundIndex = 0;
		roundIndex < numberOfTournamentRounds;
		roundIndex += 1
	) {
		const title = getRoundTitle(roundIndex, numberOfTournamentRounds)
		let roundBattles = getRoundBattles(battles, athletes.length, roundIndex)
		if (roundIndex === numberOfTournamentRounds - 1 && hasThirdPlaceBattle) {
			// In the final round, include both the final and third place battles
			roundBattles = [...roundBattles, battles.at(-1) as IBattle]
		}
		const seeds: ISeedProps[] = mapBattlesToSeeds(
			roundBattles,
			battles,
			hasThirdPlaceBattle
		)

		roundProperties.push({ title, seeds })
	}

	return roundProperties
}
