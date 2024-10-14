// SignIn.js
import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { firebaseGetUserDocument } from '../../app/helpers'
import { setAuth } from '../../features/auth/authSlice'
import { useAppDispatch } from '../../app/hooks'

function EmailLogin(): ReactElement {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate()
	const dispatch = useAppDispatch()

	// @ts-expect-error Handle function must return void
	const onFormSubmit = async (event: FormEvent): void => {
		event.preventDefault()
		try {
			await signInWithEmailAndPassword(auth, email, password)
			// Handle successful sign-in (e.g., redirect to a dashboard)
			const user = auth.currentUser
			if (user) {
				const userDocument = await firebaseGetUserDocument(user)
				if (userDocument) dispatch(setAuth(userDocument))
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
			{/* eslint-disable-next-line react/jsx-handler-names */}
			<input
				type='email'
				value={email}
				onChange={onEmailChange}
				placeholder='Email'
			/>
			{/* eslint-disable-next-line react/jsx-handler-names */}
			<input
				type='password'
				value={password}
				onChange={onPwdChange}
				placeholder='Password'
			/>
			<button type='submit'>Sign In</button>
		</form>
	)
}

export default EmailLogin
