import type { User } from 'firebase/auth'
import type { IFirebaseUserData } from '../../app/types'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { firestore } from '../../../firebaseConfig'

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
