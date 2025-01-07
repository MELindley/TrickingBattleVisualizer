import Head from 'components/Common/Head'
import type { ReactElement } from 'react'
import { Stack } from '@mui/material'
import NavBar from 'components/Common/Navbar'
import EmailSignUp from 'components/Auth/EmailSignUp'
import EmailLogin from 'components/Auth/EmailLogin'
import GoogleLogIn from 'components/Auth/GoogleLogin'
import { mainNavigation } from 'pages/Home'

export default function LoginPage(): ReactElement {
	return (
		<>
			<Head title='Arena Forge' />
			<Stack spacing={4} justifyContent='center' alignItems='stretch'>
				<NavBar navigation={mainNavigation} />
				<EmailSignUp />
				<EmailLogin />
				<GoogleLogIn />
			</Stack>
		</>
	)
}
