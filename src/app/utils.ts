import type { QueryDocumentSnapshot } from 'firebase/firestore'
import type { IAthlete, IBattle } from './types'

/**
 * Recursively sanitizes an object for Firestore by removing undefined, null, or empty string values.
 * Optionally removes the `id` field if specified.
 *
 * @param object - The object to sanitize.
 * @param removeID - Whether to remove the `id` field from the object. Default is `false`.
 * @returns A sanitized object suitable for Firestore storage.
 */
export const sanitizeObjectForFirestore = (
	object: object,
	removeID = false
): object =>
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
 * Converts a Firebase battle document snapshot into an `IBattle` object.
 *
 * @param battleDocument - The Firebase document snapshot for a battle.
 * @returns The converted `IBattle` object.
 */
export function convertFirebaseBattleDocumentToIBattle(
	battleDocument: QueryDocumentSnapshot
): IBattle {
	const battleAthletes = Object.values(
		battleDocument.data().athletes as ArrayLike<IAthlete>
	)
	return {
		id: battleDocument.id,
		athletes:
			battleAthletes.length === 0
				? [undefined, undefined]
				: (battleAthletes.length === 1
					? [...battleAthletes, undefined]
					: battleAthletes),
		winner: battleDocument.data().winner
			? (battleDocument.data().winner as IAthlete)
			: undefined,
		losers: battleDocument.data().losers
			? Object.values(battleDocument.data().losers as ArrayLike<IAthlete>)
			: undefined,
		hasRound: battleDocument.data().hasRound as number | undefined,
		hasTimer: battleDocument.data().hasTimer as number | undefined,
		order: battleDocument.data().order as number
	} as IBattle
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

export function youtubeVideoIdParser(url: string): string | false {
	const regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
	const match = url.match(regExp)
	return match && match[7].length === 11 ? match[7] : false
}
