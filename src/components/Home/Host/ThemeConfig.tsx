import type { SimplePaletteColorOptions } from '@mui/material'
import { FormLabel, InputLabel, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import type { ReactElement } from 'react'
import { useState } from 'react'
import {
	selectTournamentThemeOptions,
	setTournamentPalettePrimaryColor,
	setTournamentPaletteSecondaryColor,
	setTournamentTypographyBodyFont,
	setTournamentTypographyHeaderFont
} from '../../../features/tournament/tournamentSlice'
import Colorful from '@uiw/react-color-colorful'
import type { ColorResult } from '@uiw/color-convert'
import type { TypographyOptions } from '@mui/material/styles/createTypography'
import FontPicker from 'react-fontpicker-ts-lite'

export default function ThemeConfig(): ReactElement {
	const dispatch = useAppDispatch()

	const themeOptions = useAppSelector(state =>
		selectTournamentThemeOptions(state)
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

	const onPalettePrimaryChange = (value: ColorResult): void => {
		setPrimaryColor(value.hexa)
		dispatch(setTournamentPalettePrimaryColor(value.hexa))
	}

	const onPaletteSecondaryChange = (value: ColorResult): void => {
		setSecondaryColor(value.hexa)
		dispatch(setTournamentPaletteSecondaryColor(value.hexa))
	}

	const handleBodyFontChange = (value: string): void => {
		setBodyFont(value)
		dispatch(setTournamentTypographyBodyFont(value))
	}

	const handleHeaderFontChange = (value: string): void => {
		setHeaderFont(value)
		dispatch(setTournamentTypographyHeaderFont(value))
	}

	return (
		<Grid container sx={{ boxShadow: 3, borderRadius: 2, p: 4 }}>
			<Grid size={12} container justifyContent='center' alignItems='center'>
				<Typography variant='h3' sx={{ mb: 2 }}>
					Display Settings
				</Typography>
			</Grid>
			<Grid
				size={3}
				container
				flexDirection='column'
				justifyContent='center'
				alignItems='center'
			>
				<FormLabel id='Palette'>Palette</FormLabel>
				<InputLabel htmlFor='palette-primary-color'>Primary Color</InputLabel>
				<Colorful color={primaryColor} onChange={onPalettePrimaryChange} />
				<InputLabel htmlFor='palette-secondary-color'>
					Secondary Color
				</InputLabel>
				<Colorful color={secondaryColor} onChange={onPaletteSecondaryChange} />
			</Grid>
			<Grid size={3} container>
				<Grid size={12} textAlign='center'>
					<FormLabel id='Typography'>Typography</FormLabel>
				</Grid>
				<Grid size={6}>
					<InputLabel htmlFor='typography-body-font'>Body Font</InputLabel>
					<FontPicker
						id='typography-body-font'
						autoLoad
						defaultValue={bodyFont}
						value={handleBodyFontChange}
					/>
				</Grid>
				<Grid size={6}>
					<InputLabel htmlFor='typography-header-font'>Header Font</InputLabel>
					<FontPicker
						id='typography-header-font'
						autoLoad
						defaultValue={headerFont}
						value={handleHeaderFontChange}
					/>
				</Grid>
			</Grid>
		</Grid>
	)
}
