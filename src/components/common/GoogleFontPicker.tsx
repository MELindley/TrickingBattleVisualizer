import type { GoogleFont } from '@remotion/google-fonts'
import { getAvailableFonts } from '@remotion/google-fonts'
import type { SyntheticEvent, ReactElement } from 'react'
import { Autocomplete, TextField } from '@mui/material'

interface Properties {
	defaultValue: string
	onChange: (value: string) => void
	label: string
}

export default function GoogleFontPicker({
	defaultValue,
	onChange,
	label
}: Properties): ReactElement {
	const availableFonts = getAvailableFonts()

	const onFontChange = async (
		event: SyntheticEvent,
		value: {
			label: string
			fontFamily: string
			importName: string
			load: () => Promise<GoogleFont>
		} | null
		// @ts-expect-error Handle function must return void
	): void => {
		if (value) {
			const fonts = availableFonts.find(
				font => font.fontFamily === value.fontFamily
			)

			// Load font information
			if (fonts) {
				const loaded = await fonts.load()

				// Load the font itself
				const { fontFamily } = loaded.loadFont()

				// call The parent on ChangeFunction
				onChange(fontFamily)
			}
		}
	}

	return (
		<Autocomplete
			disablePortal
			onChange={onFontChange}
			options={availableFonts.map(font => ({
				...font,
				label: font.fontFamily
			}))}
			renderInput={parameters => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<TextField {...parameters} defaultValue={defaultValue} label={label} />
			)}
		/>
	)
}
