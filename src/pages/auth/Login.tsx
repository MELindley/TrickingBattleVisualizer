import Head from 'components/Head'
import type { ReactElement } from 'react'
import { Stack } from '@mui/material'
import NavBar from '../../components/Navbar'
import EmailSignUp from '../../components/Auth/EmailSignUp'
import EmailLogin from '../../components/Auth/EmailLogin'
import GoogleLogIn from '../../components/Auth/GoogleLogin'
import { mainNavigation } from '../Home'

export default function LoginPage(): ReactElement {
	return (
		<>
			<Head title='Tricking Battle Visualizer' />
			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				<NavBar navigation={mainNavigation} />
				<EmailLogin />
				<GoogleLogIn />
				<EmailSignUp />
			</Stack>
		</>
	)
}
