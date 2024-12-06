import Head from 'components/common/Head'
import type { ReactElement } from 'react'
import { Stack } from '@mui/material'
import NavBar from 'components/common/Navbar'
import EmailSignUp from 'components/auth/EmailSignUp'
import EmailLogin from 'components/auth/EmailLogin'
import GoogleLogIn from 'components/auth/GoogleLogin'
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
