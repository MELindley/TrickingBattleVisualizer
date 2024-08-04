import type { KeyboardEvent, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IAthlete } from 'types'
import { useMediaQuery } from 'utils'
import ImageAttribution from './ImageAttribution'
import { Button } from '@mui/material'

const PREFERRED_IMAGE_WIDTH = 384
const MOBILE_PADDING = 16
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9
const IMAGE_INDEX_BELOW_THE_FOLD = 3

interface Properties {
	athlete: IAthlete
	index: number
}

export default function AthleteCard({
	athlete,
	index
}: Properties): ReactElement {
	const isTabletAndUp = useMediaQuery('(min-width: 600px)')

	const navigate = useNavigate()
	function onDetailClick(): void {
		window.scrollTo(0, 0)
		navigate(athlete.name.toLowerCase())
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			onDetailClick()
		}
	}

	const imageWidth = Math.min(
		PREFERRED_IMAGE_WIDTH,
		window.innerWidth - MOBILE_PADDING
	)
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT)

	return (
		<div
			data-testid='AthleteCard'
			className='cursor-pointer select-none overflow-hidden rounded-lg shadow-lg focus:border-gray-300 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-50 dark:shadow-2xl'
			role='button'
			tabIndex={0}
			onClick={onDetailClick}
			onKeyDown={onKeyDown}
		>
			<div className='relative'>
				<img
					data-testid='AthleteCardImage'
					loading={
						!isTabletAndUp && index >= IMAGE_INDEX_BELOW_THE_FOLD
							? 'lazy'
							: 'eager'
					}
					decoding={
						!isTabletAndUp && index >= IMAGE_INDEX_BELOW_THE_FOLD
							? 'async'
							: 'sync'
					}
					width={imageWidth}
					height={imageHeight}
					style={{
						backgroundColor: athlete.image.color
					}}
					src={athlete.image.url}
					alt={athlete.name}
				/>
				<ImageAttribution author={athlete.image.author} />
			</div>
			<h3 data-testid='AthleteCardName' className='p-6 text-xl font-bold'>
				{athlete.name} {athlete.surname}
			</h3>
			<Button onClick={onDetailClick} variant='outlined'>
				Details
			</Button>
		</div>
	)
}
