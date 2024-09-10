import type { ReactElement } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../../firebaseConfig'
import { useNavigate } from 'react-router-dom'

export default function GoogleLogIn(): ReactElement {
	const navigate = useNavigate()
	// @ts-expect-error Handle function must return void
	const onHandleGoogleSignIn = async (): void => {
		try {
			await signInWithPopup(auth, provider)
			// const result = await signInWithPopup(auth, provider)
			// Handle successful sign-in (e.g., redirect to a dashboard)
			navigate(`/`)
		} catch {
			// Handle errors (e.g., display an error message)
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
