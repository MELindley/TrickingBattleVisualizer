import type { ChangeEvent, FormEvent, ReactElement } from 'react'
import { useState } from 'react'
import type { IAthlete } from '../../app/types'
import { firebaseAddAthleteDocument } from '../../api/Athlete/athleteApi'
import Colorful from '@uiw/react-color-colorful'
import type { ColorResult } from '@uiw/color-convert'
import { Box, InputLabel, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

interface Properties {
	callBack: (athlete: IAthlete) => void
}

export default function AthleteCreationForm({
	callBack
}: Properties): ReactElement {
	const [name, setName] = useState('')
	const [surname, setSurname] = useState('')
	const [imageUrl, setImageUrl] = useState('')
	const [imageColor, setImageColor] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState<unknown>()

	// @ts-expect-error Handle function must return void
	const onFormSubmit = async (event: FormEvent): void => {
		event.preventDefault()
		try {
			setIsLoading(true)
			// add the IAthlete to firebase, retrieve the athlete to use in callback
			const athlete = await firebaseAddAthleteDocument({
				id: 'temp',
				name,
				surname,
				image: { color: imageColor, url: imageUrl }
			})
			callBack(athlete)
		} catch (error) {
			setIsError(error) // Handle errors (e.g., display an error message)
		} finally {
			setIsLoading(false)
		}
	}

	const onNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setName(event.target.value)
	}

	const onSurnameChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setSurname(event.target.value)
	}
	const onImageColorChange = (value: ColorResult): void => {
		setImageColor(value.hexa)
	}

	const onImageUrlChange = (event: ChangeEvent<HTMLInputElement>): void => {
		setImageUrl(event.target.value)
	}

	return (
		<Box component='form' onSubmit={onFormSubmit}>
			<TextField value={surname} onChange={onSurnameChange} label='Surname' />
			<TextField value={name} onChange={onNameChange} label='Name' />
			<TextField
				value={imageUrl}
				onChange={onImageUrlChange}
				label='Image Url'
			/>
			<InputLabel htmlFor='image-color'>Image color</InputLabel>
			<Colorful color={imageColor} onChange={onImageColorChange} />
			<LoadingButton loading={isLoading} variant='contained' type='submit'>
				{isError ? (isError as Error).message : 'Add Athlete'}
			</LoadingButton>
		</Box>
	)
}
