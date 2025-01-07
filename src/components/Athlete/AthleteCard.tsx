import {
	type KeyboardEvent,
	type ReactElement,
	type MouseEvent,
	useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { IAthlete } from 'app/types'
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

export interface AthleteCardProperties {
	athlete?: IAthlete
	onCardClick?: (athlete: IAthlete) => void
	hasDetailsButton?: boolean
	isClickable?: boolean
}

const PREFERRED_IMAGE_WIDTH = 384
const MOBILE_PADDING = 16
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9

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

function AthleteCard({
	athlete = undefined,
	onCardClick = undefined,
	hasDetailsButton = false,
	isClickable = true
}: AthleteCardProperties): ReactElement {
	const navigate = useNavigate()
	const [isSelected, setIsSelected] = useState(false)

	const onDetailButtonClick = (event: MouseEvent): void => {
		event.stopPropagation()
		window.scrollTo(0, 0)
		if (athlete) navigate(encodeURIComponent(athlete.name.toLowerCase()))
	}

	const onActionAreaClick = (): void => {
		if (isClickable) {
			setIsSelected(!isSelected)
			if (athlete && onCardClick) onCardClick(athlete)
		}
	}

	const onKeyDown = (event: KeyboardEvent): void => {
		if (event.key === 'Enter') onActionAreaClick()
	}

	const { imageWidth, imageHeight } = calculateImageDimensions()

	return (
		<Card
			sx={{
				width: imageWidth,
				border: isSelected ? 'solid blue' : 'solid transparent',
				display: 'flex'
			}}
		>
			<CardActionArea
				onClick={onActionAreaClick}
				onKeyDown={onKeyDown}
				sx={{ display: 'flex', flexDirection: 'column' }}
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
						<CardContent sx={{ margin: 'auto' }}>
							<Typography gutterBottom variant='h4'>
								{athlete.name} {athlete.surname}
							</Typography>
						</CardContent>
					</>
				) : (
					<>
						<Skeleton
							variant='rectangular'
							sx={{ marginRight: 'auto' }}
							height={imageHeight}
							width={imageWidth}
						/>
						<CardContent sx={{ display: 'flex', flexGrow: 1 }}>
							<Typography gutterBottom variant='h3' sx={{ margin: 'auto' }}>
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
							component='span'
						>
							Details
						</Button>
					</CardActions>
				) : undefined}
			</CardActionArea>
		</Card>
	)
}

export default AthleteCard
