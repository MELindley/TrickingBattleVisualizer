import { type KeyboardEvent, type ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IAthlete } from '../../app/types'
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Skeleton,
	Typography
} from '@mui/material'

interface Properties {
	athlete: IAthlete | undefined
	onCardClick?: (athlete: IAthlete) => void
	hasDetailsButton?: boolean
	isClickable?: boolean
	isInLine?: boolean
}
const PREFERRED_IMAGE_WIDTH = 384
const MOBILE_PADDING = 16
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9

const calculateImageDimensions = (
	isInline?: boolean
): { imageWidth: number; imageHeight: number } => {
	const imageWidth = Math.min(
		PREFERRED_IMAGE_WIDTH,
		window.innerWidth - MOBILE_PADDING
	)
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT)
	if (isInline)
		return { imageWidth: imageWidth / 2, imageHeight: imageHeight / 2 }
	return { imageWidth, imageHeight }
}

function AthleteCard({
	athlete,
	onCardClick,
	hasDetailsButton,
	isClickable,
	isInLine
}: Properties): ReactElement {
	const navigate = useNavigate()
	const [isSelected, setIsSelected] = useState<boolean>(false)

	const onDetailButtonClick = (): void => {
		window.scrollTo(0, 0)
		if (athlete) navigate(athlete.name.toLowerCase())
	}

	const onActionAreaClick = (): void => {
		if (isClickable) {
			if (isSelected) {
				setIsSelected(false)
			} else {
				setIsSelected(true)
			}
			if (athlete && onCardClick) onCardClick(athlete)
		}
	}

	const onKeyDown = (event: KeyboardEvent): void => {
		if (event.key === 'Enter') {
			onActionAreaClick()
		}
	}

	const { imageWidth, imageHeight } = calculateImageDimensions(isInLine)

	return (
		<Card
			sx={{
				width: isInLine ? imageWidth * 1.7 : imageWidth,
				border: isSelected ? 'solid blue' : 'solid transparent',
				display: 'flex'
			}}
		>
			<CardActionArea
				onClick={onActionAreaClick}
				onKeyDown={onKeyDown}
				sx={{ display: 'flex', flexDirection: isInLine ? 'row' : 'column' }}
			>
				{athlete ? (
					<>
						<CardMedia
							component='img'
							sx={{
								height: imageHeight,
								width: isInLine ? imageHeight : imageWidth,
								backgroundColor: athlete.image?.color
							}}
							image={athlete.image?.url}
							title={`${athlete.name} ${athlete.surname}`}
							alt={athlete.name}
						/>
						<CardContent sx={{ margin: 'auto' }}>
							<Typography gutterBottom variant={isInLine ? 'h5' : 'h4'}>
								{athlete.name} {athlete.surname}
							</Typography>
						</CardContent>
					</>
				) : (
					<>
						<Skeleton
							variant='rectangular'
							height={imageHeight}
							width={isInLine ? imageHeight : imageWidth}
							sx={{ marginRight: 'auto' }}
						/>
						<CardContent
							sx={{ display: 'flex', height: imageHeight, flexGrow: 1 }}
						>
							<Typography
								gutterBottom
								variant={isInLine ? 'h5' : 'h3'}
								sx={{ margin: 'auto' }}
							>
								TBA
							</Typography>
						</CardContent>
					</>
				)}
				{hasDetailsButton ? (
					<CardActions>
						<Button
							onClick={onDetailButtonClick}
							variant='outlined'
							className='m-auto'
						>
							Details
						</Button>
					</CardActions>
				) : undefined}
			</CardActionArea>
		</Card>
	)
}

AthleteCard.defaultProps = {
	hasDetailsButton: false,
	isClickable: true,
	isInLine: false,
	onCardClick: (): void => {}
}
export default AthleteCard
