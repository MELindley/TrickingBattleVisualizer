import { type KeyboardEvent, type ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { IAthlete } from 'types'
import {
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardMedia,
	Typography
} from '@mui/material'

const PREFERRED_IMAGE_WIDTH = 384
const MOBILE_PADDING = 16
const ASPECT_RATIO_WIDTH = 16
const ASPECT_RATIO_HEIGHT = 9

interface Properties {
	athlete: IAthlete | undefined
	onCardClick?: (athlete: IAthlete) => void
	hasDetailsButton?: boolean
	isClickable?: boolean
}

export default function AthleteCard({
	athlete,
	onCardClick,
	hasDetailsButton,
	isClickable
}: Properties): ReactElement {
	const navigate = useNavigate()
	const [isSelected, setIsSelected] = useState<boolean>(false)

	function onDetailButtonClick(): void {
		window.scrollTo(0, 0)
		if (athlete) navigate(athlete.name.toLowerCase())
	}

	function onClick(): void {
		if (isClickable) {
			if (isSelected) {
				setIsSelected(false)
			} else {
				setIsSelected(true)
			}
			if (athlete && onCardClick) onCardClick(athlete)
		}
	}

	function onKeyDown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			onClick()
		}
	}

	const imageWidth = Math.min(
		PREFERRED_IMAGE_WIDTH,
		window.innerWidth - MOBILE_PADDING
	)
	const imageHeight = imageWidth / (ASPECT_RATIO_WIDTH / ASPECT_RATIO_HEIGHT)
	return (
		<Card
			sx={{
				maxWidth: imageWidth,
				border: isSelected ? 'solid blue' : 'solid transparent'
			}}
		>
			<CardActionArea onClick={onClick} onKeyDown={onKeyDown}>
				{athlete ? (
					<>
						<CardMedia
							component='img'
							sx={{
								width: imageWidth,
								height: imageHeight,
								backgroundColor: athlete.image.color
							}}
							image={athlete.image.url}
							title='green iguana'
							alt={athlete.name}
						/>
						<CardContent>
							<Typography gutterBottom variant='h3'>
								{athlete.name} {athlete.surname}
							</Typography>
						</CardContent>
					</>
				) : (
					<CardContent>
						<Typography gutterBottom variant='h3'>
							TBD
						</Typography>
					</CardContent>
				)}
				<CardActions>
					{hasDetailsButton ? (
						<Button
							onClick={onDetailButtonClick}
							variant='outlined'
							className='m-auto'
						>
							Details
						</Button>
					) : undefined}
				</CardActions>
			</CardActionArea>
		</Card>
	)
}
AthleteCard.defaultProps = {
	hasDetailsButton: false,
	isClickable: true,
	onCardClick: (): void => {}
}
