import {
	type QueryConstraint,
	type DocumentReference,
	addDoc,
	doc,
	onSnapshot,
	setDoc
} from 'firebase/firestore'
import { collection, getDocs, query } from 'firebase/firestore'
import type { IAthlete, IBattle, ITournament } from '../../app/types'
import { firestore } from '../../../firebaseConfig'
import {
	convertFirebaseBattleDocumentToIBattle,
	sanitizeObjectForFirestore
} from '../../app/utils'

/**
 * Retrieves the collection of tournaments from Firestore, optionally filtered by a query constraint.
 *
 * @param queryConstraint - Optional query constraint to filter the tournaments.
 * @returns A promise that resolves to an array of `ITournament` objects.
 */
export async function firebaseGetTournamentsCollection(
	queryConstraint?: QueryConstraint
): Promise<ITournament[]> {
	const tournamentsCollectionReference = collection(firestore, 'tournaments')
	// if a query constraint was passed, filter the tournaments by query, else retrieve all
	const tournamentsDocuments = await getDocs(
		queryConstraint
			? query(tournamentsCollectionReference, queryConstraint)
			: tournamentsCollectionReference
	)

	const battlePromises = tournamentsDocuments.docs.map(async document => {
		const battlesCollectionReference = collection(document.ref, 'battles')
		return getDocs(battlesCollectionReference)
	})

	const athletePromises = tournamentsDocuments.docs.map(async document => {
		const athletesCollectionReference = collection(document.ref, 'athletes')
		return getDocs(athletesCollectionReference)
	})

	const [battlesSnapshots, athletesSnapshots] = await Promise.all([
		Promise.all(battlePromises),
		Promise.all(athletePromises)
	])

	const battles = battlesSnapshots.map(battlesSnapshot =>
		battlesSnapshot.docs.map(battleDocument =>
			convertFirebaseBattleDocumentToIBattle(battleDocument)
		)
	)

	const athletes = athletesSnapshots.map(
		athletesSnapshot =>
			athletesSnapshot.docs.map(athleteDocument =>
				athleteDocument.data()
			) as IAthlete[]
	)

	return tournamentsDocuments.docs.map(
		(document, index) =>
			({
				battles: battles[index].sort((a, b) => a.order - b.order),
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

export async function firebaseSetTournamentBattlesListener(
	tournamentId: string,
	callback: (battles: IBattle[]) => void // Callback for battles subcollection
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

	// Listener for the battles subcollection
	onSnapshot(battlesCollectionReference, snapshot => {
		const battlesData = snapshot.docs
			.map(battleDocument =>
				convertFirebaseBattleDocumentToIBattle(battleDocument)
			)
			.sort((a, b) => a.order - b.order)
		callback(battlesData)
	})
}

export async function firebaseAddAthletesToTournament(
	tournamentId: string,
	athletes: IAthlete[]
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
	const athletePromises = []

	for (const athlete of athletes) {
		athletePromises.push(
			addDoc(athletesCollectionReference, sanitizeObjectForFirestore(athlete))
		)
	}
	await Promise.all(athletePromises)
	return athletes
}

export async function firebaseAddBattlesToTournament(
	tournamentId: string,
	battles: IBattle[]
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
	const battlePromises = []
	for (const battle of battles) {
		battlePromises.push(
			addDoc(
				battlesCollectionReference,
				sanitizeObjectForFirestore(battle, true)
			)
		)
	}
	const battleDocuments = await Promise.all(battlePromises)
	// update battles with BattleDocuments with IDs
	return battles.map((battle, index) => ({
		...battle,
		id: battleDocuments[index].id
	}))
}

export async function firebaseUpdateTournamentBattles(
	tournamentId: string,
	battles: IBattle[]
): Promise<IBattle[]> {
	const battlePromises = []
	for (const battle of battles) {
		const battleDocumentReference = doc(
			firestore,
			'tournaments',
			tournamentId,
			'battles',
			battle.id
		)
		battlePromises.push(
			setDoc(battleDocumentReference, sanitizeObjectForFirestore(battle, true))
		)
	}
	await Promise.all(battlePromises)
	return battles
}

export async function firebaseSetBattleInTournament(
	tournamentId: string,
	updatedBattle: IBattle
): Promise<IBattle> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournamentId
	)
	const battleDocumentReference = doc(
		tournamentDocumentReference,
		'battles',
		updatedBattle.id
	)
	await setDoc(
		battleDocumentReference,
		sanitizeObjectForFirestore(updatedBattle)
	)
	return updatedBattle
}

export async function firebaseSetAthleteInTournament(
	tournamentId: string,
	athleteId: string,
	updatedAthlete: IAthlete
): Promise<IAthlete> {
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
	await setDoc(
		athleteDocumentReference,
		sanitizeObjectForFirestore(updatedAthlete)
	)
	return updatedAthlete
}

export async function firebaseAddTournamentDocument(
	tournament: ITournament
): Promise<ITournament> {
	const tournamentsCollectionReference = collection(firestore, 'tournaments')
	const tournamentDocumentReference = (await addDoc(
		tournamentsCollectionReference,
		sanitizeObjectForFirestore({
			name: tournament.name,
			hasThirdPlaceBattle: tournament.hasThirdPlaceBattle,
			isFinalDifferent: tournament.isFinalDifferent,
			hostUID: tournament.hostUID
		})
	)) as DocumentReference
	await firebaseAddAthletesToTournament(
		tournamentDocumentReference.id,
		tournament.athletes
	)
	const battles = await firebaseAddBattlesToTournament(
		tournamentDocumentReference.id,
		tournament.battles
	)
	return { ...tournament, id: tournamentDocumentReference.id, battles }
}

export async function firebaseUpdateTournamentDocument(
	tournament: ITournament
): Promise<ITournament> {
	const tournamentDocumentReference = doc(
		firestore,
		'tournaments',
		tournament.id
	)
	await setDoc(
		tournamentDocumentReference,
		sanitizeObjectForFirestore(tournament, true)
	)
	await firebaseUpdateTournamentBattles(
		tournamentDocumentReference.id,
		tournament.battles
	)
	return tournament
}

export async function firebaseGetAthletesInTournament(
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

export async function firebaseGetBattlesInTournament(
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
