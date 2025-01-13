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

const ASPECT_RATIO_WIDTH = 5
const ASPECT_RATIO_HEIGHT = 4

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

	const [windowWidth, windowHeight] = useWindowSize()
	const cardWidth = windowWidth / 8.8
	const cardHeight = windowHeight / 12
	const imageWidth = cardWidth / 2
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT)

	return (
		<Card
			sx={{
				width: cardWidth,
				height: cardHeight,
				border: isSelected ? 'solid blue' : 'solid transparent',
				display: 'flex'
			}}
		>
			<CardActionArea
				onClick={onActionAreaClick}
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'flex-start'
				}}
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
							<Typography
								component='h5'
								sx={{ typography: { lg: 'h6', md: 'caption' } }}
							>
								{athlete.name} {athlete.surname}
							</Typography>
						</CardContent>
					</>
				) : (
					<>
						<Skeleton
							variant='rectangular'
							height={cardHeight}
							width={imageWidth}
						/>
						<CardContent sx={{ display: 'flex', flexGrow: 1 }}>
							<Typography
								gutterBottom
								sx={{
									margin: 'auto',
									typography: { lg: 'h6', md: 'caption' }
								}}
							>
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
