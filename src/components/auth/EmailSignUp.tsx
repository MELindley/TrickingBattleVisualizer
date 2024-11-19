import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { useNavigate } from 'react-router-dom' // Import your Firebase configuration
import { firebaseAddUserDocument, SPECTATOR_ROLE } from 'app/helpers'
import { setAuth } from 'features/auth/authSlice'
import { useAppDispatch } from 'app/hooks'

export default function EmailSignUp(): ReactElement {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	// @ts-expect-error Handle function must return void
	const onFormSubmit = async (event: FormEvent): void => {
		event.preventDefault()
		try {
			await createUserWithEmailAndPassword(auth, email, password)
			// Handle successful sign-up (e.g., redirect to a dashboard)
			const user = auth.currentUser
			if (user) {
				const userDocument = await firebaseAddUserDocument(user, SPECTATOR_ROLE)
				dispatch(setAuth(userDocument))
				navigate(`/`)
			}
		} catch {
			// Handle errors (e.g., display an error message)
		}
	}

	const onEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setEmail(event.target.value)
	}

	const onPwdChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setPassword(event.target.value)
	}

	return (
		<form onSubmit={onFormSubmit}>
			<input
				type='email'
				value={email}
				onChange={onEmailChange}
				placeholder='Email'
			/>
			<input
				type='password'
				value={password}
				onChange={onPwdChange}
				placeholder='Password'
			/>
			<button type='submit'>Sign Up</button>
		</form>
	)
}
