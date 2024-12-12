import type {
	PaletteMode,
	SimplePaletteColorOptions,
	ThemeOptions
} from '@mui/material'
import {
	Button,
	FormControlLabel,
	InputLabel,
	Switch,
	TextField,
	Typography
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import type { ChangeEvent, ReactElement } from 'react'
import { useState } from 'react'
import {
	selectTournamentThemeOptions,
	setTournamentThemeOptions
} from '../../../features/tournament/tournamentSlice'
import Colorful from '@uiw/react-color-colorful'
import type { ColorResult } from '@uiw/color-convert'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import GoogleFontPicker from '../../common/GoogleFontPicker'

export default function ThemeConfig(): ReactElement {
	const dispatch = useAppDispatch()

	const themeOptions = useAppSelector(state =>
		selectTournamentThemeOptions(state)
	)

	const [mode, setMode] = useState<PaletteMode>(
		themeOptions.palette?.mode ?? 'dark'
	)

	const [primaryColor, setPrimaryColor] = useState<string>(
		(themeOptions.palette?.primary as SimplePaletteColorOptions).main
	)
	const [secondaryColor, setSecondaryColor] = useState<string>(
		(themeOptions.palette?.secondary as SimplePaletteColorOptions).main
	)

	const [bodyFont, setBodyFont] = useState<string>(
		(themeOptions.typography as TypographyOptions).fontFamily?.toString() ??
			'Roboto'
	)
	const [headerFont, setHeaderFont] = useState<string>(
		(themeOptions.typography as TypographyOptions).h1?.fontFamily?.toString() ??
			'Roboto'
	)

	const [backgroundUrl, setBackgroundUrl] = useState<string>(
		themeOptions.background?.url ?? ''
	)

	const onPalettePrimaryChange = (value: ColorResult): void => {
		setPrimaryColor(value.hexa)
	}

	const onPaletteSecondaryChange = (value: ColorResult): void => {
		setSecondaryColor(value.hexa)
	}

	const onModeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.checked) {
			setMode('dark')
		} else {
			setMode('light')
		}
	}

	const onBodyFontChange = (value: string): void => {
		setBodyFont(value)
	}

	const onHeaderFontChange = (value: string): void => {
		setHeaderFont(value)
	}

	const onBackgroundUrlChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	): void => {
		setBackgroundUrl(event.target.value)
	}

	const onSaveButtonClick = (): void => {
		const nextThemeOptions: ThemeOptions = {
			palette: {
				mode,
				primary: {
					main: primaryColor
				},
				secondary: {
					main: secondaryColor
				}
			},
			typography: {
				fontFamily: bodyFont,
				h1: {
					fontFamily: headerFont
				},
				h2: {
					fontFamily: headerFont
				},
				h3: {
					fontFamily: headerFont
				},
				h4: {
					fontFamily: headerFont
				},
				h5: {
					fontFamily: headerFont
				},
				h6: {
					fontFamily: headerFont
				}
			},
			background: {
				url: backgroundUrl
			}
		}
		dispatch(setTournamentThemeOptions(nextThemeOptions))
	}

	return (
		<Grid
			container
			sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}
			justifyContent='center'
			alignItems='top'
		>
			<Grid size={12} container justifyContent='center'>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Display Settings
				</Typography>
			</Grid>
			<Grid
				size={3}
				container
				boxShadow={2}
				borderRadius={2}
				padding={2}
				margin={2}
				flexDirection='column'
				alignItems='center'
			>
				<Typography id='Palette' variant='h4' gutterBottom>
					Palette
				</Typography>
				<InputLabel htmlFor='palette-primary-color'>Primary Color</InputLabel>
				<Colorful color={primaryColor} onChange={onPalettePrimaryChange} />
				<InputLabel htmlFor='palette-secondary-color'>
					Secondary Color
				</InputLabel>
				<Colorful color={secondaryColor} onChange={onPaletteSecondaryChange} />
				<FormControlLabel
					control={
						<Switch
							title='Dark Mode'
							checked={mode === 'dark'}
							onChange={onModeChange}
						/>
					}
					label='Dark Mode'
				/>
			</Grid>
			<Grid
				size={3}
				container
				boxShadow={2}
				borderRadius={2}
				padding={2}
				margin={2}
				flexDirection='column'
				alignItems='center'
			>
				<Typography id='Typography' variant='h4' gutterBottom>
					Typography
				</Typography>
				<Grid size={6} textAlign='center'>
					<InputLabel htmlFor='typography-body-font'>Body Font</InputLabel>
					<GoogleFontPicker
						defaultValue={bodyFont}
						onChange={onBodyFontChange}
						label='Body Font'
					/>
				</Grid>
				<Grid size={6} textAlign='center'>
					<InputLabel htmlFor='typography-header-font'>Header Font</InputLabel>
					<GoogleFontPicker
						defaultValue={headerFont}
						onChange={onHeaderFontChange}
						label='Header Font'
					/>
				</Grid>
			</Grid>
			<Grid
				size={3}
				container
				boxShadow={2}
				borderRadius={2}
				padding={2}
				margin={2}
				flexDirection='column'
				alignItems='center'
			>
				<Typography id='Typography' variant='h4' gutterBottom>
					Background
				</Typography>
				<Grid size={12} textAlign='center'>
					<InputLabel htmlFor='background-url-input'>
						Image Url or Youtube Link
					</InputLabel>
					<TextField
						id='background-url-input'
						label='Link'
						variant='outlined'
						value={backgroundUrl}
						onChange={onBackgroundUrlChange}
					/>
				</Grid>
			</Grid>
			<Grid size={12} container justifyContent='center'>
				<Button
					variant='contained'
					size='large'
					color='success'
					onClick={onSaveButtonClick}
				>
					Apply & Save
				</Button>
			</Grid>
		</Grid>
	)
}
