// InlineAthleteCard.tsx
import type { AthleteCardProperties } from './AthleteCard'
import type { ReactElement } from 'react'
import { useState } from 'react'
import {
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Skeleton,
	Typography
} from '@mui/material'
import { useWindowSize } from '@react-hook/window-size'

type InlineAthleteCardProperties = AthleteCardProperties

const PREFERRED_IMAGE_WIDTH = 200
const MOBILE_PADDING = 0
const ASPECT_RATIO_WIDTH = 5
const ASPECT_RATIO_HEIGHT = 4

const calculateImageDimensions = (): {
	imageWidth: number
	imageHeight: number
} => {
	const imageWidth = Math.min(
		PREFERRED_IMAGE_WIDTH,
		window.innerWidth - MOBILE_PADDING
	)
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT)
	return { imageWidth, imageHeight }
}

function InlineAthleteCard({
	athlete,
	onCardClick,
	isClickable = false
}: InlineAthleteCardProperties): ReactElement {
	const [isSelected, setIsSelected] = useState(false)
	const onActionAreaClick = (): void => {
		if (isClickable) {
			setIsSelected(!isSelected)
			if (athlete && onCardClick) onCardClick(athlete)
		}
	}

	const { imageWidth, imageHeight } = calculateImageDimensions()
	const [windowWidth, windowHeight] = useWindowSize()

	return (
		<Card
			sx={{
				width: windowWidth / 8,
				height: windowHeight / 12,
				border: isSelected ? 'solid blue' : 'solid transparent',
				display: 'flex'
			}}
		>
			<CardActionArea
				onClick={onActionAreaClick}
				sx={{ display: 'flex', flexDirection: 'row' }}
			>
				{athlete ? (
					<>
						<CardMedia
							component='img'
							sx={{
								height: imageHeight,
								width: imageWidth,
								backgroundColor: athlete.image?.color ?? 'grey'
							}}
							image={athlete.image?.url}
							title={`${athlete.name} ${athlete.surname}`}
							alt={athlete.name}
						/>
						<CardContent>
							<Typography variant='h5'>
								{athlete.name} {athlete.surname}
							</Typography>
						</CardContent>
					</>
				) : (
					<>
						<Skeleton
							variant='rectangular'
							height={imageHeight}
							width={windowWidth / 8}
						/>
						<CardContent sx={{ display: 'flex', flexGrow: 1 }}>
							<Typography gutterBottom variant='h5' sx={{ margin: 'auto' }}>
								TBA
							</Typography>
						</CardContent>
					</>
				)}
			</CardActionArea>
		</Card>
	)
}
export default InlineAthleteCard
