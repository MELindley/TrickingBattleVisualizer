import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import type { ReactElement } from 'react'
import Footer from './Footer'
import ElementWithBackground from './ElementWithBackground'
import { useAppSelector } from '../../app/hooks'
import { selectTournamentThemeOptions } from '../../features/tournament/tournamentSlice'

function Layout(): ReactElement {
	const themeOptions = useAppSelector(state =>
		selectTournamentThemeOptions(state)
	)
	return (
		<Box display='flex' flexDirection='column' minHeight='100vh'>
			<Box component='main' flexGrow={1}>
				<ElementWithBackground backgroundUrl={themeOptions.background?.url}>
					<Outlet />
				</ElementWithBackground>
			</Box>
			<Footer />
		</Box>
	)
}

export default Layout
