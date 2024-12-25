import type { IAthlete } from '../../app/types'
import { addDoc, collection, getDoc, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'
import { sanitizeObjectForFirestore } from '../../app/utils'

/**
 * Retrieves the collection of athletes from Firestore.
 *
 * @returns A promise that resolves to an array of `IAthlete` objects.
 */
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

export async function firebaseAddAthleteDocument(
	athlete: IAthlete
): Promise<IAthlete> {
	const athletesCollectionReference = collection(firestore, 'athletes')
	const athletesImageCollectionReference = collection(firestore, 'athleteImage')

	const athleteImageDocumentReference = await addDoc(
		athletesImageCollectionReference,
		sanitizeObjectForFirestore({
			color: athlete.image?.color,
			url: athlete.image?.url
		})
	)

	const athleteDocumentReference = await addDoc(
		athletesCollectionReference,
		sanitizeObjectForFirestore({
			name: athlete.name,
			surname: athlete.surname,
			image: athleteImageDocumentReference
		})
	)

	return { ...athlete, id: athleteDocumentReference.id }
}
