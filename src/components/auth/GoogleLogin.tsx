import type { ReactElement } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { SPECTATOR_ROLE } from 'app/helpers'
import { useAppDispatch } from 'app/hooks'
import { setAuth } from 'features/auth/authSlice'
import {
	firebaseAddUserDocument,
	firebaseGetUserDocument
} from '../../api/User/userApi'

export default function GoogleLogIn(): ReactElement {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	// @ts-expect-error Handle function must return void
	const onHandleGoogleSignIn = async (): void => {
		try {
			const userCredentials = await signInWithPopup(auth, provider)
			const { user } = userCredentials
			const userDocument = await (user.metadata.creationTime ===
			user.metadata.lastSignInTime
				? firebaseAddUserDocument(user, SPECTATOR_ROLE)
				: firebaseGetUserDocument(user))
			if (userDocument) dispatch(setAuth(userDocument))
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
