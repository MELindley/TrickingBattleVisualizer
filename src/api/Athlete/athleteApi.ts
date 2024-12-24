import type { IAthlete } from '../../app/types'
import { collection, getDoc, getDocs } from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'

/**
 * Retrieves the collection of athletes from Firestore.
 *
 * @returns A promise that resolves to an array of `IAthlete` objects.
 */
export default async function firebaseGetAthleteCollection(): Promise<
	IAthlete[]
> {
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
