import type { ReactElement } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import {
	firebaseAddUserDocument,
	firebaseGetUserDocument
} from '../../app/helpers'
import type { IFirebaseUserData } from '../../app/types'
import { useAppDispatch } from '../../app/hooks'
import { setUserRole } from '../../features/auth/authSlice'

export default function GoogleLogIn(): ReactElement {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	// @ts-expect-error Handle function must return void
	const onHandleGoogleSignIn = async (): void => {
		try {
			const userCredentials = await signInWithPopup(auth, provider)
			const { user } = userCredentials

			if (user.metadata.creationTime === user.metadata.lastSignInTime) {
				// new user create the users database document containing the user role
				await firebaseAddUserDocument(user, 'participant')
				dispatch(setUserRole('participant'))
			} else {
				// retrieve userDocument and update user role
				const userDocument = (await firebaseGetUserDocument(
					user
				)) as IFirebaseUserData
				dispatch(setUserRole(userDocument.role))
			}

			// Handle successful sign-in (e.g., redirect to a dashboard)
			navigate(`/`)
		} catch {
			/* empty */
		}
	}
	return (
		<div>
			<button type='button' onClick={onHandleGoogleSignIn}>
				Sign in with Google
			</button>
		</div>
	)
}
